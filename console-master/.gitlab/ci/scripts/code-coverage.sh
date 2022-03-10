#!/bin/bash
set -euo pipefail

TARGET=coverage-report
TMPDIR=.merge
PROJECT_DIR=${PROJECT_DIR:-$PWD}
NYC="yarn nyc"

rm -rf ${TARGET} ${TMPDIR} nycscan-results
mkdir -p ${TARGET} ${TMPDIR} nycscan-results

echo "[covareage]  Scanning source files to build empty coverage map"
${NYC} --nycrc-path ./tools/ci/nycrc.js --reporter json --source-map false --temp-dir ".nyc_scan" --report-dir nycscan-results ./tools/bin/true.js

mkdir -p ${PROJECT_DIR}/cypress-results ${PROJECT_DIR}/test-results

find ${PROJECT_DIR}/cypress-results ${PROJECT_DIR}/test-results nycscan-results \
  -type f -name coverage-final.json | (
  while read line
  do
    out=$(echo "$line" | sed -e 's;/;-;g')
    cp "${line}" "${TMPDIR}/${out}"
  done
)

echo "[covareage]  Combining coverage results"
${NYC} merge ${TMPDIR} ${TARGET}/coverage-final.json

echo "[covareage]  Generating coverage reports"
${NYC} report --temp-dir ${TARGET} --report-dir ${TARGET} \
  `jq -r '.reporters[] | "--reporter=" + .' .nycrc.json`

rm ${TARGET}/coverage-final.json
