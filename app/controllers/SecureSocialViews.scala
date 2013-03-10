package controllers

import play.api.mvc.{RequestHeader, Request}
import play.api.templates.Html
import play.api.{Logger, Plugin, Application}
import securesocial.core.{Identity, SecuredRequest, SocialUser}
import play.api.data.Form
import securesocial.controllers.Registration.RegistrationInfo
import securesocial.controllers.PasswordChange.ChangeInfo
import securesocial.controllers.TemplatesPlugin

/**
 * Override the default views of secure social module.
 *
 * @param application
 */
class SecureSocialViews(application: Application) extends TemplatesPlugin {
  override def getLoginPage[A](implicit request: Request[A], form: Form[(String, String)], msg: Option[String] = None): Html = {
    views.html.authentification.login(form, msg, request.acceptLanguages.map(_.code).mkString(", "))
  }

  override def getSignUpPage[A](implicit request: Request[A], form: Form[RegistrationInfo], token: String): Html = {
    securesocial.views.html.Registration.signUp(form, token)
  }

  override def getStartSignUpPage[A](implicit request: Request[A], form: Form[String]): Html = {
    securesocial.views.html.Registration.startSignUp(form)
  }

  override def getStartResetPasswordPage[A](implicit request: Request[A], form: Form[String]): Html = {
    securesocial.views.html.Registration.startResetPassword(form)
  }

  def getResetPasswordPage[A](implicit request: Request[A], form: Form[(String, String)], token: String): Html = {
    securesocial.views.html.Registration.resetPasswordPage(form, token)
  }

  def getPasswordChangePage[A](implicit request: SecuredRequest[A], form: Form[ChangeInfo]):Html = {
    securesocial.views.html.passwordChange(form)
  }

  def getNotAuthorizedPage[A](implicit request: Request[A]): Html = {
    securesocial.views.html.notAuthorized()
  }

  def getSignUpEmail(token: String)(implicit request: RequestHeader): String = {
    securesocial.views.html.mails.signUpEmail(token).body
  }

  def getAlreadyRegisteredEmail(user: Identity)(implicit request: RequestHeader): String = {
    securesocial.views.html.mails.alreadyRegisteredEmail(user).body
  }

  def getWelcomeEmail(user: Identity)(implicit request: RequestHeader): String = {
    securesocial.views.html.mails.welcomeEmail(user).body
  }

  def getUnknownEmailNotice()(implicit request: RequestHeader): String = {
    securesocial.views.html.mails.unknownEmailNotice(request).body
  }

  def getSendPasswordResetEmail(user: Identity, token: String)(implicit request: RequestHeader): String = {
    securesocial.views.html.mails.passwordResetEmail(user, token).body
  }

  def getPasswordChangedNoticeEmail(user: Identity)(implicit request: RequestHeader): String = {
    securesocial.views.html.mails.passwordChangedNotice(user).body
  }
}
