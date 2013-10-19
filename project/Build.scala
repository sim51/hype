import sbt._
import Keys._

import play.Project._

object ApplicationBuild extends Build {

    val appName         = "hype"
    val appVersion      = "1.0-SNAPSHOT"

    val appDependencies = Seq(
      "securesocial" %% "securesocial" % "logisima-SNAPSHOT",
      "com.typesafe" %% "play-plugins-mailer" % "2.1.0",
      jdbc,
      anorm
    )

    val main = play.Project(appName, appVersion, appDependencies).settings(
      resolvers += "Local Play Repository" at "file://usr/local/play/play2/current/repository/local",
      resolvers += Resolver.url("sbt-plugin-snapshots", url("http://repo.scala-sbt.org/scalasbt/sbt-plugin-snapshots/"))(Resolver.ivyStylePatterns),
      resolvers += Resolver.url("sbt-plugin-release", url("http://repo.scala-sbt.org/scalasbt/sbt-plugin-releases/"))(Resolver.ivyStylePatterns),
      resolvers += Resolver.url("typesafe-release", url("http://repo.typesafe.com/typesafe/releases/"))(Resolver.ivyStylePatterns)
    )

}
