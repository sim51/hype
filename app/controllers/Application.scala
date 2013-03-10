package controllers

import play.api.mvc._
import play.api.mvc.Cookie
import play.api.Play.current
import play.api.i18n.Messages
import play.api.libs.json.Json
import scala.Some
import play.api.Logger

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
            Ok(views.html.index(request.user, "Coucou"))
              .withCookies(Cookie("token",oAuthInfo2.accessToken))
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
    Ok(Json.toJson(i18n.get(lang.code)))
  }
}