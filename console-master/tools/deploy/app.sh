#!/bin/bash

set -euo pipefail

echo
echo deploy/app.sh "$@"

src_dir=${1}
app=${src_dir}
shift

. tools/deploy/common.sh

set -x

# Copy hashed/immutable app assets
aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude 'package.json' --exclude '*.ts' --exclude '*.gitkeep' --exclude 'index.html' --exclude 'cdn/*' $flags_sync "$src_root/$src_dir/" "$dest/$app"

# # TODO: when we deploy modularly
# # Copy hashed/immutable cdn assets
# aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude 'package.json' --exclude '*.ts' $flags_sync "$src_root/cdn/modules" "$dest/cdn/modules"

# Copy short-lived index.html files to mangled paths
aws s3 cp --cache-control "public, max-age=60" $flags "$src_root/index.html" "$dest/$app"

if [ "$app" == "launcher" ]
then
  # Copy short-lived index.html files to session-managed paths

  ## Launcher routes
  # login routes
  aws s3 cp --cache-control "public, max-age=60" $flags "$src_root/index.html" "$dest/session/launcher/login"
  aws s3 cp --cache-control "public, max-age=60" $flags "$src_root/index.html" "$dest_root/admin/index.jsp"

  # logout routes
  aws s3 cp --cache-control "public, max-age=60" $flags "$src_root/index.html" "$dest/session/launcher/logout"

  ## Vtx routes
  # login routes
  aws s3 cp --cache-control "public, max-age=60" $flags "$src_root/index.html" "$dest/session/vtx"
fi
