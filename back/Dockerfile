FROM bellsoft/liberica-openjdk-debian:21 AS builder
ARG JAR_FILE=workspace/build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", \
            "-Xms1400m", \
            "-Xmx1400m", \
            "-jar", \
            "-Dspring.profiles.active=prod", \
            "/app.jar"]
