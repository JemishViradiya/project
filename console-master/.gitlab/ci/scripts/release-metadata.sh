#!/bin/bash

mkdir -p prod/uc/.well-known
if [ -z "$RELEASE_TAG" ]
then
  RELEASE_TAG="r${CI_PIPELINE_IID}"
fi
echo '{ "release": "'${RELEASE_TAG}'", "sha": "'"${CI_COMMIT_SHA}"'" }' > prod/uc/.well-known/release
cp prod/uc/.well-known/release prod/uc/.well-known/release.json
