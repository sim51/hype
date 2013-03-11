package controllers

import play.api.mvc._
import play.api.mvc.Cookie
import play.api.Play.current
import play.api.i18n.{Lang, Messages}
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
}