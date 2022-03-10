#!/bin/bash

index=${CI_NODE_INDEX:-1}
total=${CI_NODE_TOTAL:-1}

start=$(( index - 1 ))

node_modules/.bin/nx print-affected "$@" | \
  jq -Sr '.tasks | map(.target.project) | .[((. | length) / '$total' | ceil | . * '$start'):((. | length) / '$total' | ceil | . * '$index')] | .[]'
