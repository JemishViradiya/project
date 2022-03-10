#!/bin/sh

set -euo pipefail

echo
echo deploy/docs.sh

src_dir=docs
app=docs

. tools/deploy/common.sh


# Copy documentation projects
if [ -d "$app" ]
then
  aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude '*.html' --exclude '*.ico' $flags_sync "$app" "$dest_root/$app"

  aws s3 sync --cache-control 'no-store, must-revalidate' --exclude '*' --include '*.html' --include '*.ico' $flags "$app" "$dest_root/$app"
fi


src_dir=graph
app=graph
echo deploy/graph.sh

. tools/deploy/common.sh
# Copy dep-graph projects
if [ -d "$app" ]
then
  aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude '*.html' --exclude '*.ico' $flags_sync "$app" "$dest_root/$app"

  aws s3 sync --cache-control 'no-store, must-revalidate' --exclude '*' --include '*.html' --include '*.ico' $flags "$app" "$dest_root/$app"
fi

# Copy index files
aws s3 sync --cache-control 'public, max-age=31536000' $flags public "$dest_root"
