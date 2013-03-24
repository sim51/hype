package controllers

import play.api.cache.Cache
import play.api.data._
import play.api.data.Forms._
import play.api.i18n.{Lang, Messages}
import play.api.Logger
import play.api.libs.json.{JsString, JsObject, JsValue, Json}
import play.api.libs.ws.{Response, WS}
import play.api.mvc._
import play.api.Play
import play.api.Play.current

import com.typesafe.plugin._
import scala.Some
import io.Source
import play.api.libs.iteratee.{Concurrent, Iteratee}
import play.api.libs.concurrent.Execution.Implicits._
import securesocial.core.SecureSocial
import concurrent.{Await, Future}
import scala.concurrent.duration._

/**
 * Application's controllers.
 * @author bsimard
 */
object Application extends Controller with securesocial.core.SecureSocial {

  /**
   * Default action to get angularJS application.
   * @return
   */
  def index = UserAwareAction { implicit request =>
    request.user match {
      case Some(user) => {
        user.oAuth2Info match {
          case Some(oAuthInfo2) => {
            Logger.debug("Having user with token !: " + oAuthInfo2.accessToken)
            val cookie:Cookie =  Cookie("token", "\"" + oAuthInfo2.accessToken + "\"", None , "/", None, false, false)
            Ok(views.html.index(request.user)).withCookies(cookie)
          }
          case None => {
            Logger.debug("Having user without token !")
            Ok(views.html.index(request.user))
          }
        }
      }
      case None => {
        Ok(views.html.index(request.user))
      }
    }
  }

  /**
   * JSON action to retrive all messages.
   * @return
   */
  def messages = Action { implicit request =>
    val i18n:Map[String, Map[String, String]] = Messages.messages
    Logger.debug("Language is " + lang.code)
    if (i18n.get(lang.code).isEmpty){
      val defaultLang :Lang = new Lang("fr")
      Ok(Json.toJson(i18n.get(defaultLang.code)))
    }
    else{
      Ok(Json.toJson(i18n.get(lang.code)))
    }
  }

  /**
   * JSON action to generate a unique uuid that be pull
   * into cache during 15min.
   * @return
   */
  def token = Action { implicit request =>
    val uuid :String = java.util.UUID.randomUUID().toString()
    Cache.set(uuid, true, 600)
    Ok(Json.toJson(uuid))
  }

  /**
   * JSON action to retrieve all messages.
   * @return
   */
  def mail = Action { implicit request =>
    Form(
      tuple(
        "name" -> nonEmptyText,
        "email" -> email,
        "message" -> nonEmptyText,
        "token" -> nonEmptyText
      )
    ).bindFromRequest.fold(
    formWithErrors => BadRequest,
    {
      case (name, email, message, uuid) =>
        val subject :String = Play.current.configuration.getString("contact.subject").getOrElse("")
        Play.current.configuration.getString("contact.to") match {
          case Some(to) => {
            Cache.get(uuid) match {
              case Some(uuid) => {
                val mail = use[MailerPlugin].email
                mail.setSubject(subject)
                mail.addRecipient(to)
                mail.addFrom(name + "<" + email + ">")
                //sends text/text
                mail.send(message)
                Ok("")
              }
              case None => {
                Forbidden("Token doesn't exist or has expired")
              }
            }
          }
          case None => {
            InternalServerError("There is no email for destination defined into application.conf")
          }
        }
    }
    )
  }

  /**
   * Retrieve a template of presentation, and send it back into pure text.
   *
   * @return
   */
  def template = Action { implicit request =>
    val is = Application.getClass().getResourceAsStream("/public/template/revealjs/index.html")
    val src = Source.fromInputStream(is)
    val txt = src.mkString
    src.close ()
    Ok(txt)
  }

  /**
   * Action that do a proxy on gists  to display it has HTML.
   *
   * @return
   */
  def view(id:String, filename:String) = Action { implicit request =>
    Async {
      val url = "https://gist.github.com/raw/" + id + "/" + java.net.URLEncoder.encode(filename  + ".html", "UTF-8").replace("+", "%20")
      Logger.debug("Calling " + url)
      WS.url(url).get().map { response =>
        if (response.status == 200){
          Ok(views.html.prez.see(response.body.replace("<!-- ###HYPE_INJECTION_CODE### -->", "")))
        }
        else{
          NotFound("Oups !!!")
        }
      }
    }
  }

  /**
   * Action that do a proxy on gists  to display it has HTML for viewer.
   * Moreover, we do a little injection of JS code for WS !
   *
   * @return
   */
  def see(id:String, filename:String) = Action { implicit request =>
    Async {
      val url = "https://gist.github.com/raw/" + id + "/" + java.net.URLEncoder.encode(filename  + ".html", "UTF-8").replace("+", "%20")
      Logger.debug("Calling " + url)
      WS.url(url).get().map { response =>
        if (response.status == 200){
          val is = Application.getClass().getResourceAsStream("/public/template/revealjs/ws-see.js")
          val src = Source.fromInputStream(is)
          val js = "<script type=\"text/javascript\">" + src.mkString.replace("###ID###",id).replace("###DOMAIN###", request.host) + "</script>"
          Ok(views.html.prez.see(response.body.replace("<!-- ###HYPE_INJECTION_CODE### -->", js)))
        }
        else{
          NotFound("Oups !!!")
        }
      }
    }
  }

  /**
   * Action that do a proxy on gists  to display it has HTML.
   * Moreover, we do a little injection of JS code for WS !
   * Only the owner can "run" the presentation.
   *
   * @return
   */
  def run(id:String, filename:String) = SecuredAction { implicit request =>
    if(isGistOwner(id, request.user)) {
      Async {
        val url = "https://gist.github.com/raw/" + id + "/" + java.net.URLEncoder.encode(filename + ".html", "UTF-8").replace("+", "%20")
        Logger.debug("Calling " + url)
        WS.url(url).get().map { response =>
          if (response.status == 200){
            val is = Application.getClass().getResourceAsStream("/public/template/revealjs/ws-run.js")
            val src = Source.fromInputStream(is)
            val js = "<script type=\"text/javascript\">" + src.mkString.replace("###ID###",id).replace("###DOMAIN###", request.host) + "</script>"
            Ok(views.html.prez.see(response.body.replace("<!-- ###HYPE_INJECTION_CODE### -->", js)))
          }
          else{
            NotFound("Oups !!!")
          }
        }
      }
    }
    else{
      Forbidden("This is not your gist. You can fork it !")
    }
  }

  /**
   * Webscoket for presentation !
   *
   * @return
   */
  val (controlsStream, controlsChannel) = Concurrent.broadcast[JsValue]
  def ws(id:String) = WebSocket.using[JsValue] { request =>
    val in = Iteratee.foreach[JsValue] { msg =>
      val h:JsValue =  msg.\("h")
      val v:JsValue =  msg.\("v")
      Logger.debug(msg.toString())
      SecureSocial.currentUser(request) match {
        case Some(user) => {
          if(isGistOwner(id, user)) {
            Logger.debug("message will be sending")
            controlsChannel.push(JsObject(Seq("id"->JsString(id), "h"->h, "v"->v)))
          }
        }
      }
    }
    (in, controlsStream)
  }

  /**
   * Function to know if the user is the owner of the presentation id.
   *
   * @param id
   * @param user
   * @return
   */
  def isGistOwner(id:String, user:securesocial.core.Identity): Boolean = {
    val value :Future[Boolean] = user.oAuth2Info match {
      case Some(oAuthInfo2) => {
        val futureResp: Future[Response] = WS.url("https://api.github.com/gists/" + id + "?token=" + oAuthInfo2.accessToken).get()
        futureResp.map { response =>
          if(response.status == 200){
            val owner = response.json.\("user").\("id")
            Logger.debug("Owner of the gist is " + owner)
            Logger.debug("Current user is " + user.id.id)
            if(owner.toString() == user.id.id.toString()){
              Logger.debug("isGistOwner is true")
              true
            }
            else{
              Logger.debug("isGistOwner is false")
              false
            }
          }
          else {
            Logger.debug("isGistOwner is false")
            false
          }
        }
      }
      case None => Future(false)
    }
    Await.result(value, 10 seconds)
  }
}
