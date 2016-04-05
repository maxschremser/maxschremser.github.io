---
layout: post
title: Spring Boot Application with Jersey
categories: [spring, jersey, java]
tags: [spring-boot]
fullview: true
comments: true
---

Originally insprired by **[geowarin](http://geowarin.github.io/a-simple-spring-boot-and-jersey-application.html)**'s blog 
(A Simple Spring Boot and Jersey Application) I was ambitioned to make it run with my favorite build Tools. 

#### 1. Setting up the Project

1. I have started with a new Project in IntelliJ, choosing the **Spring Initializr** Project, which is a GUI for 
[start.spring.io](https://start.spring.io). 

2. After defining the project **Name** (spring-jersey), **Type** (Gradle Project), **Group** (com.schremser), 
**Artifact** (spring-jersey) and **Package** (com.schremser.spring.jersey) 

3. I have selected the Spring Boot **Version** (1.3.3) and Dependencies. 
 
 a. Jersey (JAX-RS)
 b. REST Docs
 c. Actuator

4. Next I have set up a Gradle project with the necessary dependencies.
{% highlight Groovy %}
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

5. You find a working example at my github project [spring-jersey-test](https://github.com/maxschremser/spring-jersey-test).