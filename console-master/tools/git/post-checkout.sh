#!/bin/bash

set -e

params=(${HUSKY_GIT_PARAMS})
sha1=${params[0]}
sha2=${params[1]}
full_checkout=${params[2]}

GIT_DIR=${GIT_DIR:-.git}

if ! [ "${sha1:-1}" '==' "${sha2:-2}" -o "${full_checkout}" '==' "0" -o -d "$GIT_DIR"/rebase-merge" -o -d "$GIT_DIR"/rebase-apply" ]
then
  test -z "${HUSKY_GIT_PARAMS}" || echo "husky > Set HUSKY_SKIP_HOOKS=1 to skip this behaviour"
  if [ -z "${sha1}" ] || ! git diff --quiet "${sha1}" "${sha2}" -- yarn.lock
  then
    make dev-install
  fi
  make dev-deps
fi