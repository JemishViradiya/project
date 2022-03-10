#!/bin/bash

set -exu

COMMENT="COMMENT-$$.txt"
TOKEN_ARG="${2:-}"
GITLAB_TOKEN="${2:-TESTBOT-TOKEN}"
CURL=curl

if [ -z "${RELEASE_MERGE_REQUEST_IID:-}" ]
then
  RELEASE_MERGE_REQUEST_IID=$(echo "$CI_COMMIT_DESCRIPTION" | sed -n -e 's/^See merge request [^!]*!//gp')
fi

# Skip during preparation phase
if [ -z "${TOKEN_ARG:-}" ] || [ "${CI_ENVIRONMENT_ACTION:-}" == "prepare" ] || [ -z "${RELEASE_MERGE_REQUEST_IID:-}" ]
then
  CURL="echo curl"
  # or test with `TestBot`
  # GITLAB_TOKEN=$CI_TESTBOT_TOKEN
fi

if [ -z "${RELEASE_MERGE_REQUEST_IID:-}" ]
then
  RELEASE_MERGE_REQUEST_IID=${CI_MERGE_REQUEST_IID:-0}
fi

cat "$1" CHANGELOG.txt | tee "$COMMENT"

# comment on the MR with the constructed changelog (arg1)
$CURL -X POST --silent --show-error --fail --include "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${RELEASE_MERGE_REQUEST_IID}/notes" \
    --data-urlencode "body@$COMMENT" \
    --header "PRIVATE-TOKEN: $GITLAB_TOKEN" || true
