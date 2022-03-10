#!/bin/bash

set -euo pipefail

bash ./tools/bin/build-cdn.sh

echo
echo deploy/cdn.sh:deploy

src_dir=cdn
app="modules"

. tools/deploy/common.sh

# Copy hashed/immutable cdn assets
aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude 'package.json' --exclude '*.ts' $flags_sync "$src_root/$app/" "$dest/$src_dir/$app"

# Copy release metadata
# NOTE: flags_sync will have `--size-only` which means if the local release metadata files are the same size as on s3 the metadata
#       will *not* be sync'd. $flags should *not* include size-only and is safe to use.
aws s3 sync --delete --cache-control 'no-store, must-revalidate' $flags "${S3_SYNC_SRCDIR:-prod}/uc/.well-known/" "$dest/.well-known/"
