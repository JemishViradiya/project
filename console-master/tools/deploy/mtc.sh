#!/bin/bash

set -euo pipefail

if [ "${CI_COMMIT_BRANCH:-}" = "production" ] || [ "${CI_MERGE_REQUEST_TARGET_BRANCH_NAME:-}" = "production" ]; then
  echo "Not deploying MTC in UC production deployments"
  exit 0
fi

echo
echo deploy/mtc.sh "$@"

src_dir=${1}
app=${2:-$src_dir}
shift

SITE=mtc
if [ "$CI_JOB_NAME" = "review" ]; then
  app=${SITE}/${app}
  SITE=console
fi
. tools/deploy/common.sh

set -x

# Copy hashed/immutable app assets
aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude 'package.json' --exclude '*.ts' --exclude '*.gitkeep' --exclude 'index.html' --exclude 'cdn/*' $flags_sync "$src_root" "$dest_root/$app"

# # TODO: when we deploy modularly
# # Copy hashed/immutabgle cdn assets
# aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude 'package.json' --exclude '*.ts' $flags_sync "$src_root/cdn/modules" "$dest_root/cdn/modules"

# Copy short-lived index.html files to mangled paths
aws s3 cp --cache-control "public, max-age=60" $flags "$src_root/index.html" "$dest_root/$app/index.html"
