FROM openjdk:17-jdk-alpine
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} demo-0.0.1-SNAPSHOT.jar
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh          # 실행 권한 설정
ENTRYPOINT ["java","-jar","/demo-0.0.1-SNAPSHOT.jar"]
CMD ["/entrypoint.sh"]
