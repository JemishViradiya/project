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
[ -n "${RELEASE_MERGE_REQUEST_IID:-}" ] || exit 0

if [ -z "${TOKEN_ARG:-}" ] || [ -z "${RELEASE_MERGE_REQUEST_IID:-}" ]
then
  CURL="echo curl"
fi

cat "$1" CHANGELOG.txt | tee "$COMMENT"

$CURL --silent --fail "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${RELEASE_MERGE_REQUEST_IID}/notes" \
      --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
      -o mr-comments.json
touch mr-comments.json
COMMENT_ID=$(
  jq '.[] | select(.body | test("'"$(head -n1 "$COMMENT")"'") ) | .id' mr-comments.json
)

if [ -z "$(cat CHANGELOG.txt)" ]
then
  if [ "${CI_COMMIT_BRANCH:-}" == "production" ] || [ "${CI_MERGE_REQUEST_TARGET_BRANCH_NAME:-}" == "production" ]
  then
    echo "  < empty >" >> "$COMMENT"
  else
    echo "Empty changelog: refusing to comment on MR ${RELEASE_MERGE_REQUEST_IID}"
    CURL="echo curl"
  fi
fi

if [ -n "$COMMENT_ID" ]
then
  # update existing MR comment
  $CURL -X PUT --silent --show-error --fail --include "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${RELEASE_MERGE_REQUEST_IID}/notes/${COMMENT_ID}" \
    --data-urlencode "body@$COMMENT" \
    --header "PRIVATE-TOKEN: $GITLAB_TOKEN" || true

else

  # comment on the MR with the constructed changelog (arg1)
  $CURL -X POST --silent --show-error --fail --include "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${RELEASE_MERGE_REQUEST_IID}/notes" \
      --data-urlencode "body@$COMMENT" \
      --header "PRIVATE-TOKEN: $GITLAB_TOKEN" || true

fi
