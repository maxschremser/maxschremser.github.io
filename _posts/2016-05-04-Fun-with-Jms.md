---
layout: post
title: Fun with Jms
categories: [jms, spring, java]
tags: [java,spring]
fullview: false
comments: true
---

Today I wanted to create a Spring configured client / server application. The server listens on a configured queue for 
incoming messages. The client sends a message to the message queue which the server will display.
 
 
 
 
 
 
 
 
 
 
#### Configure the **Gradle** project structure
- we start with a project name, let us choose **spring-jms** referenced as **PROJECT_HOME**. Open a terminal window or command prompt and create the directory "spring-jms". 
{% highlight bash %}
mkdir spring-jms
cd spring-jms
{% endhighlight %}

- Create 3 submodules **server**, **client** and **core**.
{% highlight bash %}
mkdir server
mkdir client
mkdir core
{% endhighlight %}

- Create a **lib** directory for libraries not allowed to be resolved from mavencentral. *The JMS jar files are not allowed 
to be distributed via mavencentral, they are shipped with an installation of OpenMQ et al*. We will use the lib directory
in our gradle dependency configuration.
{% highlight bash %}
mkdir lib
{% endhighlight %}

- Create a **settings.gradle** file with the following content, it includes our three submodules into our gradle project.
{% highlight bash %}
include 'core', 'server', 'client'
{% endhighlight %}

- Create a **build.gradle** file containing configurations for all our (sub)projects. The project **core** is a dependency 
for the modules **client** and **server** as it defines the connection factory to the JMS server. It is not included in the
this gradle configuration - otherwise it would be a dependency to itself.
{% gist maxschremser/b8cd8608dbaf9d4bd49c028d8583bbbe %}












#### Install and Start **Oracle OpenMQ-5.1**
- Download the binaries for your operating system from [**mq.java.net**](https://mq.java.net/downloads/index.html)
- unpack the downloaded zip file to a directory, and export it as a variable OPENMQ_HOME.
- **start** a message broker on port **7676** with name **jms_test**.
{% highlight bash %}
$OPENMQ_HOME/mq/bin/imqbrokerd -name jms_test -port 7676 > /tmp/imqbrokerd.out 2>&1 &
{% endhighlight %}

- Now we need a Java Naming Directory. **Create** a directory **jms** and inside create a new directory **jms_test**. This
directory will contain our JNDI Binding file holding the connection information to the JMS server. 
{% highlight bash %}
mkdir -p jms/jms_test
{% endhighlight %}

##### Administration Console
- Start the **Administration Console** 
{% highlight bash %}
$OPENMQ_HOME/mq/bin/imqadmin
{% endhighlight %}

- Create a new Broker **jms_test** in the Broker store with Host **localhost** and Port **7676**. 
- **Connect** to the broker
- **Add** a new Destination for **importQueue** and **exportQueue** with unlimited active Consumers.
- **Add** a new Object Store **ConnectionFactory**.
- Set **Property** *java.naming.factory.initial* to *com.sun.jndi.fscontext.RefFSContextFactory*.
- Set **Property** *java.naming.provider.url* to *file:&lt;PROJECT_HOME&gt;/jms/jms_test*.
  This is where the *.bindings* file was written by imqadmin.
- Set **Property** *java.naming.security.principal* to *guest*.
- Set **Property** *java.naming.security.credentials* to *guest*.
- Add a **Connection Factory** with Lookup-Name **ConnectionFactory** of Factory-Typ *Connection Factory*.
- Click through the tabs and change user, password, JMSX properties, Connection Type, Host, Port and so on.

##### Copy JMS Jar files
- **change** to $OPENMQ_HOME/mq/lib
- **copy** *fscontext.jar*, *imq.jar*, *jms.jar* into **&lt;PROJECT_HOME&gt;/lib** directory.












#### The "core" Module
The **core** module contains only a JndiConfiguration class.
The JndiConfiguration provides a ConnectionFactory based on the properties of default.properties file from the dependents.
The JNDI Environment will setup the JMS Connection and the required importQueue. As both, the *server* and *client* 
need to access the JMS Server they will share this configuration.

- Change into the **core** directory and create a java package directory.
{% highlight bash %}
cd core
mkdir -p src/main/java/com/schremser/spring/jms/core
{% endhighlight %}
In this case **com.schremser.spring.jms.core** is the package name for the **JndiConfiguration** class. The **@Configuration**
uses the **default.properties** file to inject values for the **@Value** annotated class variables. The property 
 **jms.connection.factory** reuses the configured JNDI Connection Lookup-Name **ConnectionFactory** of the Object Store.
 **jms.queue.import** creates an object of type Destination which is in our case **importQueue**.
The JndiConfiguration class exposes our beans annotated with @Bean annotation to our application.

- Create a new Java Class **JndiConfiguration**
{% gist maxschremser/7cd2d2ae4dbd0dce47fc1f9c6b135b0e %}
That's it, well done.






#### The "server" Module
The **server** module is a submodule, that spawns a server for listening on a configured Queue (importQueue) for new 
messages. The JmsApplication, which is our server, exposes one bean, the **queueMessageListener** which reuses the 
JndiConfiguration from the *core* module. The Configuration gives access to the connectionFactory and the importQueue beans,
that hold the objects for communication. Once the listener bean is started it will process each message in the queue 
using the customized **queueMessageReceiver** bean. The receiver has a little job, it logs the message to our **logback** configuration.

- Change into the **server** directory and create a java package directory.
{% highlight bash %}
cd server
mkdir -p src/main/java/com/schremser/spring/jms/server
{% endhighlight %}
In this case **com.schremser.spring.jms.server** is the package name for the **JmsServer** class. The *@Configuration* **JndiConfiguration**
is *@Autowired* to the Spring Boot Application. 
 
- Create a new **build.gradle** file, declaring module **core** as a dependency and adding the *application* plugin with
 main class *JmsServer*.
 {% gist maxschremser/870c7e65abccb850ee73e0a287d1a6ca %}

- The **JmsServer** class starts the beans of the spring context in order to *run()*. The server starts the messageListener
on the configured **importQueue** using the **connectionFactory**.
The connectionFactory needs a **default.properties** file to lookup the JNDI Object. So let's create *default.properties* 
file first:
{% highlight bash %}
cd server
mkdir -p src/main/resources
{% endhighlight %}
Within the *resources* directory create a **default.properties** file. To see how your JMS Server is secured take a look
into your products documentation.
{% gist maxschremser/09e6f3475f5f700f9c17784fd558f024 %}

And the **JmsServer** class, it starts the message listener on the configured Destination queue using the connection factory.
{% gist maxschremser/0012b0d6bec27cc395e143307fe33bd4 %}

- Start your **JmsServer** using gradle's *run* task. 
{% highlight bash %}
gradle -q server:run
{% endhighlight %}












#### The "client" Module
The **client** module is a submodule, that reads your message from standard input and adds it to the queue. You can put
messages into the queues without a server being started. Out JMS Server application will read the messages from the queue 
and process them in their order. The JmsClient sends messages using Spring's JmsTemplate helper class to send messages to 
the queue.

- Change into the **client** directory and create a java package directory.
{% highlight bash %}
cd server
mkdir -p src/main/java/com/schremser/spring/jms/client
{% endhighlight %}
In this case **com.schremser.spring.jms.client** is the package name for the **JmsClient** class. The *@Configuration* **JndiConfiguration**
is *@Autowired* to the Spring Boot Application, just as in the server module.
 
- Create a new **build.gradle** file, declaring module **core** as a dependency and adding the *application* plugin with
 main class *JmsClient*. Change gradle's standardInput property for the run task to be able to read the messages from standard 
 input.
 {% gist maxschremser/2c62e8970311f5a60d1979089c71cbdb %}

- The **JmsClient** class starts the beans of the spring context in order to *run()*. The client uses the **JmsTemplate**
helper class from the spring framework. The connectionFactory needs a **default.properties** file to lookup the JNDI Object. 
So let's create *default.properties* file first:
{% highlight bash %}
cd client
mkdir -p src/main/resources
{% endhighlight %}
Within the *resources* directory create a **default.properties** file. 
{% gist maxschremser/09e6f3475f5f700f9c17784fd558f024 %}

- The **JmsClient** class.
{% gist maxschremser/2c3411160dbd16f3385a53b27cf61a1e %}


- Start your **JmsClient** using gradle's *run* task. 
{% highlight bash %}
gradle -q client:run
{% endhighlight %}








 

The whole project is hosted under [GitHub](https://github.com/maxschremser/spring-jms)

*Additional Documentation:*

- [SpringIO - Messaging with JMS](https://spring.io/guides/gs/messaging-jms/)
- [SpringIO - Auto-configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-auto-configuration.html)
- [Gradle.org - Why doesn't System.in.read() block when I'm using Gradle](https://discuss.gradle.org/t/why-doesnt-system-in-read-block-when-im-using-gradle/3308)
- [stefanalexandru - Spring 4 – JMS Connection with Java Config and Weblogic as JMS Provider](http://www.stefanalexandru.com/java/spring-4-jms-connection-with-java-config-and-weblogic-as-jms-provider)
- [petrikainulainen - Getting Started With Gradle: Creating a Multi-Project Build](http://www.petrikainulainen.net/programming/gradle/getting-started-with-gradle-creating-a-multi-project-build/)