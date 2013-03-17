package controllers

import play.api.cache.Cache
import play.api.data._
import play.api.data.Forms._
import play.api.i18n.{Lang, Messages}
import play.api.Logger
import play.api.libs.json.Json
import play.api.libs.ws.WS
import play.api.mvc._
import play.api.Play
import play.api.Play.current

import com.typesafe.plugin._
import scala.Some
import io.Source

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
            val cookie :Cookie =  Cookie("token", "\"" + oAuthInfo2.accessToken + "\"", -1, "/", None, false, false )
            Ok(views.html.index(request.user)).withCookies(cookie)
          }
          case None => {
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
   * Action that do a proxy on gists
   * @return
   */
  def see(id:String, filename:String) = Action { implicit request =>
    Async {
      WS.url("https://gist.github.com/raw/" + id + "/" + filename).get().map { response =>
        if (response.status == 200){
          Ok(views.html.prez.see(response.body.replace("###HYPE_INJECTION_CODE###", "")))
        }
        else{
          NotFound("Oups !!!")
        }
      }
    }
  }
}
