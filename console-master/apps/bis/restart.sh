#!/bin/bash

kill -9 $(ps | grep node | awk '{$1=$1}1' | cut -d' '  -f1); yarn start
