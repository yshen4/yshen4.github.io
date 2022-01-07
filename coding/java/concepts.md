# Java Concepts

This document keep notes on Java concepts

## EAR, WAR, and JAR

A Java EE application is delivered in a Java Archive (JAR) file, a Web Archive (WAR) file, or an Enterprise Archive (EAR) file. A WAR or EAR file is a standard JAR (.jar) file with a .war or .ear extension. Using JAR, WAR, and EAR files and modules makes it possible to assemble a number of different Java EE applications using some of the same components. No extra coding is needed; it is only a matter of assembling (or packaging) various Java EE modules into Java EE JAR, WAR, or EAR files

* .ear: EAR (Enterprise Application aRchive) is a file format used by Jakarta EE for packaging one or more modules into a single archive so that the deployment of the various modules onto an application server happens simultaneously and coherently
  - [EAR (file format)](https://en.wikipedia.org/wiki/EAR_(file_format))
  - [Java Platform, Enterprise Edition: The Java EE Tutorial](https://docs.oracle.com/javaee/7/tutorial/packaging001.htm)
* .jar: The .jar files contain libraries, resources and accessories files like property files.
  - [The Java Archive (JAR) File Format: The Basics](https://web.archive.org/web/20120626012843/http://java.sun.com/developer/Books/javaprogramming/JAR/basics)
  - [JAR (file format)](https://en.wikipedia.org/wiki/JAR_(file_format))
* .war: The war file contains the web application that can be deployed on any servlet/jsp container. The .war file contains jsp, html, javascript and other files necessary for the development of web applications.
  - [WAR (file format)](https://en.wikipedia.org/wiki/WAR_(file_format))
