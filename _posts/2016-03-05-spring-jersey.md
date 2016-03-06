---
layout: post
title: Spring Boot Application with Jersey
categories: [spring, jersey, java]
tags: [spring-boot]
fullview: true
comments: true
---

### Creating a Spring Boot Application in Java with spring-boot, jersey and security
Originally insprired by **[geowarin](http://geowarin.github.io/a-simple-spring-boot-and-jersey-application.html)**'s blog
I have learned some interesting new features about Spring, Spring-Boot and Jersey. I especially liked the **JerseyTest**
which seems to be very beneficial for testing RESTful applications.

# Setting up the Project
Following Geowarin's Blog, I have assembled my Gradle dependencies in **build.gradle** Configuration File. 
{% highlight gradle %}
buildscript {
	ext {
		springBootVersion = '1.3.3.RELEASE'
	}
	repositories {
		mavenCentral()
	}
	dependencies {
		classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}") 
	}
}

apply plugin: 'java'
apply plugin: 'idea'
apply plugin: 'eclipse'
apply plugin: 'spring-boot'

jar {
	baseName = 'spring-jersey-test'
	version = '0.0.1-SNAPSHOT'
}
sourceCompatibility = 1.8
targetCompatibility = 1.8

repositories {
	mavenCentral()
}


dependencies {
	compile('org.springframework.boot:spring-boot-starter-parent:+')
	compile('org.springframework.boot:spring-boot-starter-web:+')
	compile('org.springframework.boot:spring-boot-starter-jersey:+')
	compile('org.springframework.boot:spring-boot-starter-actuator:+')
	compile('org.springframework.boot:spring-boot-starter-security:+')
	compile('org.glassfish.jersey.containers:jersey-container-servlet:+')
	compile('org.glassfish.jersey.ext:jersey-spring3:+')
	compile('org.glassfish.jersey.media:jersey-media-moxy:+')

	testCompile('org.springframework.boot:spring-boot-starter-test:+')
	testCompile('org.glassfish.jersey.test-framework.providers:jersey-test-framework-provider-inmemory:2.22.1')
	testCompile('org.skyscreamer:jsonassert:+')
	testCompile('org.assertj:assertj-core:+')
}


eclipse {
	classpath {
		 containers.remove('org.eclipse.jdt.launching.JRE_CONTAINER')
		 containers 'org.eclipse.jdt.launching.JRE_CONTAINER/org.eclipse.jdt.internal.debug.ui.launcher.StandardVMType/JavaSE-1.8'
	}
}

task wrapper(type: Wrapper) {
	gradleVersion = '2.9'
}
{% endhighlight %}


### References
[geowarin](http://geowarin.github.io/a-simple-spring-boot-and-jersey-application.html)
