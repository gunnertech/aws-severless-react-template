#!/bin/bash
# ./scripts/git/setup.sh <STAGE>
# ./scripts/git/setup.sh cody
# ./scripts/git/setup.sh staging
# ./scripts/git/setup.sh prod
set -e
IFS='|'

STAGE=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$DIR/../../

git init

# mkdir -p ${PROJECT_ROOT}.git/

cat >> ${PROJECT_ROOT}.git/config << EndOfMessage
[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}/"]
	UseHttpPath = true
	helper = !aws --profile <project-name>-${STAGE}developer codecommit credential-helper $@
[remote "${STAGE}"]
	url = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}
	fetch = +refs/heads/*:refs/remotes/origin/*
	pushurl = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}
[branch "${STAGE}"]
	remote = ${STAGE}
	merge = refs/heads/${STAGE}
EndOfMessage

git checkout -b $STAGE
git add .; git commit -am "initial commit"