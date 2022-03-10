#!/bin/bash

set -exu

CURL=curl
# Skip during preparation phase
if [ "${CI_ENVIRONMENT_ACTION:-}" == "prepare" ] || [ -n "${CI_MERGE_REQUEST_IID:-}" ]
then
  CURL="echo curl"
  CI_DEPLOYBOT_TOKEN=${CI_TESTBOT_TOKEN}
fi

$CURL -X DELETE --fail "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/repository/tags/deployment%2F${REGION}" \
    --header "PRIVATE-TOKEN: $CI_DEPLOYBOT_TOKEN" \
    || true

$CURL -X POST --show-error --fail --include "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/repository/tags" \
    --data "tag_name=deployment/${REGION}" \
    --data "ref=${CI_COMMIT_SHA}" \
    --data-urlencode "message=$DEPLOYMENT_DESCRIPTION" \
    --header "PRIVATE-TOKEN: $CI_DEPLOYBOT_TOKEN"

$CURL -X POST --show-error --fail --include "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/repository/commits/${CI_COMMIT_SHA}/comments" \
    --data-urlencode "note=Deployed to ${REGION} by ${GITLAB_USER_NAME} <${GITLAB_USER_EMAIL}>" \
    --header "PRIVATE-TOKEN: $CI_DEPLOYBOT_TOKEN"
