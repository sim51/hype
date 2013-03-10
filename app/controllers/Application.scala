package controllers

import play.api.mvc._
import securesocial.core._
import securesocial.core.UserId
import play.api.mvc.Cookie
import scala.Some

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
            Ok(views.html.index(request.user, request.acceptLanguages.map(_.code).mkString(", "), "Coucou"))
              .withCookies(Cookie("token",oAuthInfo2.accessToken))
          }
          case None => {
            Ok(views.html.index(request.user, request.acceptLanguages.map(_.code).mkString(", "), "Coucou"))
          }
        }
      }
      case None => {
        Ok(views.html.index(request.user, request.acceptLanguages.map(_.code).mkString(", "), "Coucou"))
      }
    }
  }
  
}