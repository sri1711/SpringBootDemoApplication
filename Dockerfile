FROM eclipse-temurin:21-jdk

ARG artifact=target/springboot-demo-app-0.0.1.jar

WORKDIR /opt/app

COPY  ${artifact} app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
