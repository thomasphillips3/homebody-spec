// JitPack-buildable Kotlin/JVM module exposing the generated kotlinx.serialization
// models. JitPack builds any tag of this public repo into a Maven artifact
// (com.github.thomasphillips3:homebody-spec:<tag>) with no publishing step
// required beyond tagging a release. See docs.jitpack.io.
plugins {
    kotlin("jvm") version "2.1.0"
    kotlin("plugin.serialization") version "2.1.0"
    `maven-publish`
}

group = "com.github.thomasphillips3"
version = "0.2.0"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(17)
}

sourceSets {
    main {
        kotlin.srcDirs("generated/kotlin")
    }
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
}
