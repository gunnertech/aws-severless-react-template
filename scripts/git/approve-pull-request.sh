#!/bin/bash
# ./scripts/git/approve-pull-request.sh <stage> <request-id> <iteration-end-date>
# ./scripts/git/approve-pull-request.sh staging 5 20190404
set -e
IFS='|'

STAGE=$1
REQUEST_ID=$2
ITERATION_END_DATE=$3

aws codecommit merge-pull-request-by-fast-forward --pull-request-id $REQUEST_ID --repository-name <project-name>-$STAGE --profile <project-name>-${STAGE}developer
