#!/bin/bash
# ./scripts/git/setup.sh <developer-name>
# ./scripts/git/setup.sh cody
set -e
IFS='|'

DEVELOPER_NAME=$1

git checkout -b $DEVELOPER_NAME
git add .; git commit -am "initial commit";
git checkout -b staging
git merge $DEVELOPER_NAME;
git checkout -b master
git merge staging;
git checkout $DEVELOPER_NAME