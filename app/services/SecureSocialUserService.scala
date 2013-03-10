/**
 * Copyright 2012 Jorge Aliss (jaliss at gmail dot com) - twitter: @jaliss
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package services

import play.api.{Logger, Application}
import securesocial.core._
import securesocial.core.providers.Token
import securesocial.core.UserId
import play.api.cache.Cache
import play.api.Play.current


/**
 * A Sample In Memory user securesocial in Scala
 *
 * IMPORTANT: This is just a sample and not suitable for a production environment since
 * it stores everything in memory.
 */
class SecureSocialUserService(application: Application) extends UserServicePlugin(application) {

  def find(id: UserId): Option[Identity] = {
    Cache.getAs[Identity](id.id)
  }

  def findByEmailAndProvider(email: String, providerId: String): Option[Identity] = {
    None
  }

  def save(user: Identity): Identity = {
    Logger.debug("user = %s".format(user))
    Cache.set(user.id.id, user, 3600)
    user
  }

  def save(token: Token) {}

  def findToken(token: String): Option[Token] = {
    None
  }

  def deleteToken(uuid: String) {}

  def deleteTokens() {}

  def deleteExpiredTokens() {}
}
