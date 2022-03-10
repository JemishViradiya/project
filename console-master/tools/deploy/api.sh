#!/bin/bash

set -euo pipefail

echo
echo deploy/api.sh "$@"

src_dir=api

. tools/deploy/common.sh

# Copy hashed/immutable library asssets
aws s3 sync --delete --cache-control 'public, max-age=60' --content-type 'application/json' --exclude '*.ts'  --exclude 'package.json' $flags_sync "$src_root/" "$dest_api"
