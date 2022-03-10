#!/bin/bash

set -euo pipefail

echo
echo deploy/lib.sh "$@"

lib_name=${1}
src_dir=${2:-$1}
shift

lib=${lib_name}
. tools/deploy/common.sh

# Copy hashed/immutable library asssets
aws s3 sync --delete --cache-control 'public, max-age=60' --exclude '*.ts' --exclude '*.gitkeep' --exclude 'package.json' $flags "$src_root/" "$dest/$lib"
