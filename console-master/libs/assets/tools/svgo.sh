#!/bin/bash

set -eu

outputDir="$1"
srcDir="libs/icons"

mkdir -p ${outputDir}/icons ${outputDir}/logos

cp $srcDir/src/index.js ${outputDir}/index.js
cp $srcDir/package.json ${outputDir}/

cd $srcDir
node tools/svgo ${outputDir}