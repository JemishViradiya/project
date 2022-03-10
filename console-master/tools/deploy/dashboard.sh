#!/bin/bash

set -euo pipefail

echo
echo deploy/dashboard.sh "$@"

src_dir=${1}
app=${src_dir}
shift

. tools/deploy/app.sh ${app}

if [ "$commit_branch" == "master" ] || [ "$commit_branch" == "production" ]
then
  # Copy OOB dashboard config files to s3
  aws s3 sync --delete --cache-control "public, max-age=60" $flags "$src_root/$app/assets/config/" "$dest_config_root/dashboards" --exclude "*" --include "*.json"
fi
