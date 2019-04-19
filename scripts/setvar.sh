#!/bin/bash
# ./setvar.sh <name> <value>
# ./setvar.sh sentry-url https://xxxxxxxxx@sentry.io/xxxxx
# ./setvar.sh dev-app-id "blah blah blah"
# ./setvar.sh staging-app-id "blah blah blah"

export LC_CTYPE=C 
export LANG=C

set -e
IFS='|'
NAME=$1
VALUE=$2
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

find $DIR/.. -type f -print0 | xargs -0 sed -i "" "s/<$NAME>/$VALUE/g"
