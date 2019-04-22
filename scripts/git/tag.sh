#!/bin/bash
# ./scripts/git/tag.sh <stage> <iteration-end-date>
# ./scripts/git/tag.sh staging 20190404
set -e
IFS='|'

STAGE=$1
ITERATION_END_DATE=$2

git checkout $STAGE; git pull $STAGE;
git tag released/$ITERATION_END_DATE
git push $STAGE released/$ITERATION_END_DATE
