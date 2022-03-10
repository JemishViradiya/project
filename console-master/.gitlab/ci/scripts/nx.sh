#!/bin/bash

set -euo pipefail

COMMAND=${1}
MODE=${2:-$NX_MODE}
PARALLEL=${NX_JOBS:-4}

declare -a task_pids=()

PROJECTLIST="${AFFECTED:-}"
if [ "${MODE}" == "all" ]
then
  PROJECTLIST="$(cat workspace.json | jq -r '.projects | keys | .[]')"
fi

EXIT_CODE=0

for projectName in ${PROJECTLIST}
do
  projectRoot=$(jq -r '.projects["'${projectName}'"]' workspace.json)
  command=$(cat "${projectRoot}/project.json" | jq -r '.targets.'"$COMMAND"'.options.command | select (. != null)')
  if [ -z "${command}" ]
  then
    continue
  fi

  eval "${command}" &
  cpid="$!"
  task_pids+=("$cpid")
  echo " running as task ${cpid}"

  sleep 0.1

  if [ ${#task_pids[@]} -ge ${PARALLEL} ]
  then
    job=${task_pids[0]}
    unset task_pids[0]
    task_pids=( ${task_pids[@]} )
    if ! wait -n ${job}
    then
      EXIT_CODE=1
      echo "At $COMMAND failed for task ${job}" >&2
    fi
  fi
done

echo "waiting for remaining tasks"
for job in "${task_pids[@]}"
do
  if ! wait -n ${job}
  then
    EXIT_CODE=1
    echo "At $COMMAND failed for task ${job}" >&2
  fi
done

wait

if [ "$EXIT_CODE" != "0" ]
then
  echo "At least one $COMMAND failed" >&2
fi
exit $EXIT_CODE
