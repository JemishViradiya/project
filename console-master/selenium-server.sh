#!/bin/bash

docker rm -f selenium-chrome
docker run --rm --name selenium-chrome -d --net host --shm-size="2g" -e SE_NODE_OVERRIDE_MAX_SESSIONS=true -e SE_NODE_MAX_SESSIONS=10 -e SE_SESSION_REQUEST_TIMEOUT=5 -e SE_SESSION_RETRY_INTERVAL=2 selenium/standalone-chrome:4
