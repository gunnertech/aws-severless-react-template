#!/bin/bash
# ./scripts/project/setup.sh <project-name>
export LC_CTYPE=C 
export LANG=C

set -e
IFS='|'
PROJECT=$1
# INITIAL_STAGE=$2
# DESTINATION=$3
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# : ${DESTINATION:=~/workspace/javascript/serverless}
PROJECT_ROOT=$DIR/../../

rm -rf $PROJECT_ROOT/.git
cd $PROJECT_ROOT
git init
# curl -o $DIR/$PROJECT/.git/config https://gist.githubusercontent.com/CodySwannGT/ea1dcb937426d8121576b59334000d58/raw/b2e7bc24b48dcd1c8cd8abd0ab3272f0ec4ce0cb/config.txt
# curl -o $DIR/$PROJECT/serverless/secrets.yml https://gist.githubusercontent.com/CodySwannGT/b26d5f204bcd02f7f34c20775cb9ae88/raw/5965be72dadea4015e6a7045209ab6635355b3c0/secrets.yml
# find $DIR/$PROJECT/.git/ -type f -print0 | xargs -0 sed -i "" "s/<developer-name>/$INITIAL_STAGE/g"
# find $DIR/$PROJECT/serverless/secrets.yml -type f -print0 | xargs -0 sed -i "" "s/<developer-name>/$INITIAL_STAGE/g"
find $PROJECT_ROOT -type f -print0 | xargs -0 sed -i "" "s/<project-name>/$PROJECT/g"

