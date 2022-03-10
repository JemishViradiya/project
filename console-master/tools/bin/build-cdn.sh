#!/bin/sh

set -eu

echo
echo deploy/cdn.sh:build

dest=prod

rm -rf $dest/cdn
mkdir -p $dest/cdn

set -x
for cdn in $dest/*/cdn/modules
do
  cp -r $cdn $dest/cdn/
done

# cleanup
find $dest -type f '(' -name 'package.json' -o -name '*.ts' ')' -delete
