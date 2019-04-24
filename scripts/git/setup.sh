#!/bin/bash
# ./scripts/git/setup.sh <stage>
# ./scripts/git/setup.sh cody
# ./scripts/git/setup.sh staging
# ./scripts/git/setup.sh prod
set -e
IFS='|'

STAGE=$1

git checkout -b $STAGE
git add .; git commit -am "initial commit"