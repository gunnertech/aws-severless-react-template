#!/bin/bash
# ./scripts/git/approve-pull-request.sh <current-stage> <target-stage> <iteration-end-date>
# ./scripts/git/approve-pull-request.sh cody staging 20190404
set -e
IFS='|'

CURRENT_STAGE=$1
TARGET_STAGE=$2
ITERATION_END_DATE=$3


git checkout -b $CURRENT_STAGE-$ITERATION_END_DATE
git push origin $CURRENT_STAGE-$ITERATION_END_DATE
REQUEST_ID=$(aws codecommit create-pull-request --title "${ITERATION_END_DATE} Iteration Pull Request" --description "${ITERATION_END_DATE} Iteration Pull Request" --client-request-token ${ITERATION_END_DATE} --targets repositoryName=<project-name>-${TARGET_STAGE},sourceReference=${ITERATION_END_DATE} --profile <project-name>-${TARGET_STAGE}developer  --output json --query pullRequest.pullRequestId)

echo "****************************************************"
echo "*                                                  *"
echo "*                                                  *"
echo "* Your pull request id is ${REQUEST_ID}            *"
echo "*                                                  *"
echo "*                                                  *"
echo "****************************************************"