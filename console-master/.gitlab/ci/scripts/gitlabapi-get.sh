#!/bin/bash

set -exu
GITHUB_API_REST=$1
GITLAB_TOKEN="${2:-$CI_API_TOKEN}"
CURL=curl

temp=`basename $0`
TMPFILE=`mktemp /tmp/${temp}.XXXXXX` || exit 1

function rest_call {
    curl --silent --fail $1 -H "PRIVATE-TOKEN: $GITLAB_TOKEN" >> $TMPFILE
}

# single page result-s (no pagination), have no Z-Total-Pages header, the grep result is empty                                                                                                                                                                  
last_page=`curl --silent --fail --head "${GITHUB_API_REST}" --header "PRIVATE-TOKEN: $GITLAB_TOKEN" | tr -d '\r' | sed -En 's/^X-Total-Pages: (.*)/\1/p'`

# does this result use pagination?                                                                                                                                                                                                                       
if [ -z "$last_page" ]; then
    # no - this result has only one page                                                                                                                                                                                                                 
    rest_call "${GITHUB_API_REST}"
else
    # yes - this result is on multiple pages                                                                                                                                                                                                             
    for p in `seq 1 $last_page`; do
        rest_call "${GITHUB_API_REST}?page=$p"
    done
fi

cat $TMPFILE
