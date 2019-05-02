#!/bin/bash
# ./scripts/git/setup.sh <stage>
# ./scripts/git/setup.sh cody
# ./scripts/git/setup.sh staging
# ./scripts/git/setup.sh prod
set -e
IFS='|'

STAGE=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$DIR/../../

echo EndOfMessage
[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${stage}/"]
	UseHttpPath = true
	helper = !aws --profile <project-name>-${stage}developer codecommit credential-helper $@
[remote "${stage}"]
	url = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${stage}
	fetch = +refs/heads/*:refs/remotes/origin/*
	pushurl = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${stage}
[branch "${stage}"]
	remote = ${stage}
	merge = refs/heads/${stage}
EndOfMessage >> ${PROJECT_ROOT}/.git/config

git checkout -b $STAGE
git add .; git commit -am "initial commit"
