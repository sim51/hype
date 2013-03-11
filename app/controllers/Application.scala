package controllers

import scala.Some

import play.api.data._
import play.api.data.Forms._
import play.api.i18n.{Lang, Messages}
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc._
import play.api.mvc.Cookie
import play.api.Play
import play.api.Play.current

import com.typesafe.plugin._

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
            Ok(views.html.index(request.user, "Coucou"))
              .withCookies(cookie)
          }
          case None => {
            Ok(views.html.index(request.user, "Coucou"))
          }
        }
      }
      case None => {
        Ok(views.html.index(request.user, "Coucou"))
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
   * JSON action to retrive all messages.
   * @return
   */
  def mail = Action { implicit request =>
    Form(
      tuple(
        "name" -> nonEmptyText,
        "email" -> email,
        "message" -> nonEmptyText
      )
    ).bindFromRequest.fold(
      formWithErrors => BadRequest,
      {
        case (name, email, message) =>
          val subject :String = Play.current.configuration.getString("contact.subject").getOrElse("")
          Play.current.configuration.getString("contact.to") match {
            case Some(to) => {
              val mail = use[MailerPlugin].email
              mail.setSubject(subject)
              mail.addRecipient(to)
              mail.addFrom(name + "<" + email + ">")
              //sends text/text
              mail.send(message)
              Ok("")
            }
            case None => {
              InternalServerError("There is no email for destination defined into application.conf")
            }
          }
      }
    )

  }
}