import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "hype"
    val appVersion      = "1.0-SNAPSHOT"

    val appDependencies = Seq(
      "securesocial" %% "securesocial" % "master-SNAPSHOT",
      "com.typesafe" %% "play-plugins-mailer" % "2.1.0"
    )

    val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
      resolvers += Resolver.url("sbt-plugin-snapshots", url("http://repo.scala-sbt.org/scalasbt/sbt-plugin-snapshots/"))(Resolver.ivyStylePatterns),
      resolvers += Resolver.url("sbt-plugin-release", url("http://repo.scala-sbt.org/scalasbt/sbt-plugin-releases/"))(Resolver.ivyStylePatterns),
      resolvers += Resolver.url("typesafe-release", url("http://repo.typesafe.com/typesafe/releases/"))(Resolver.ivyStylePatterns)
    )

}
