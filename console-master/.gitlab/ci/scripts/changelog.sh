#!/bin/bash

set -exu

COMMENT="COMMENT-$$.txt"
TOKEN_ARG="${2:-}"
GITLAB_TOKEN="${2:-$CI_API_TOKEN}"
CURL=curl
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"


if [ -z "${RELEASE_MERGE_REQUEST_IID:-}" ]
then
  RELEASE_MERGE_REQUEST_IID=$(echo "$CI_COMMIT_DESCRIPTION" | sed -n -e 's/^See merge request [^!]*!//gp')
fi
if [ -z "${RELEASE_MERGE_REQUEST_IID:-}" ]
then
  RELEASE_MERGE_REQUEST_IID=${CI_MERGE_REQUEST_IID:-}
fi
if ! [ -n "${RELEASE_MERGE_REQUEST_IID:-}" ]
then
  echo "Refusing to create changelog for non-existing MR" >&2
  exit 0
fi

bash ${SCRIPT_DIR}/gitlabapi-get.sh "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${RELEASE_MERGE_REQUEST_IID}/commits" >> mr-commits.json

$CURL --silent --fail "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${RELEASE_MERGE_REQUEST_IID}" \
      --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
      -o mr.json

(
  jq -r '.description' mr.json
  jq -r '.[] | .message' mr-commits.json
) | grep -oh '\b[A-Z]\{3,6\}-[0-9]\+\b' | sort | uniq | (while read line; do echo "  - $line"; done)
