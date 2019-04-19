#!/bin/bash
# ./setvar.sh <variable-name> <value>
export LC_CTYPE=C 
export LANG=C

set -e
IFS='|'
VARIABLE_NAME=$1
VALUE=$2
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

find $DIR -type f -print0 | xargs -0 sed -i "" "s|<${VARIABLE_NAME}>|$VALUE|g"
