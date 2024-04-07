#!/bin/bash

# Dockerfile 에서 ENTRYPOINT ["/entrypoint.sh"] 로 실행된다

start_server() {
  (sleep 30; ./gradlew buildAndReload --continuous -PskipDownload=true -x Test) &
  ./gradlew bootRun -PskipDownload=true
}

start_server
