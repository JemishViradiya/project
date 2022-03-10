#!/bin/sh

set -euxo pipefail

file=prod/bis/index.html

# don't use 'sed' with '-i' for compatibility between platforms as code can be run both locally and on CI
sed -E "s/<title>(.*)<\/title>/<title>BlackBerry Persona Analytics<\/title>/g" "$file" > "$file.new"
mv -- "$file.new" "$file"
