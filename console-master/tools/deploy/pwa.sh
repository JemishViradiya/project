#!/bin/bash

set -euo pipefail

echo
echo deploy/pwa.sh "$@"

src_dir=pwa
lib=pwa

. tools/deploy/common.sh

# Copy hashed/immutable library asssets into /uc/cdn/assets
aws s3 sync --delete --cache-control 'public, max-age=31536000' --exclude '*.ts'  --exclude 'package.json' --exclude 'error/**' --exclude '*.d.ts' --exclude 'robots.txt' --exclude 'sw.nomodule.js*' $flags_sync "$src_root/$lib/" "$dest_root/$lib"

# Copy short-lived service-worker entrypoint files into /
aws s3 sync --cache-control 'public, max-age=60' --exclude '*' --include 'sw.*' $flags "$src_root/" "$dest_root"

# Copy robots.txt into /
aws s3 sync --cache-control 'public, max-age=600' --exclude '*' --include 'robots.txt' $flags "$src_root/$lib" "$dest_root"


# Use BB branded errors if variable is set
src_error=error
if [ "$BB_BRANDING" == true ]; then
    src_error='error/bb_branded'
fi

# Copy error/*.html into /
aws s3 sync --delete --cache-control 'no-store, must-revalidate' $flags "$src_root/$lib/$src_error" "$dest_root/uc/error"
