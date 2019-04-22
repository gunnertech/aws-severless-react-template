#!/bin/bash
# ./scripts/rds/setup.sh <stage>
set -e
IFS='|'

STAGE=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}../../"

git checkout $STAGE;
cd $PROJECT_HOME/serverless;


sls deploy -s $STAGE
$DIR/enable-api $STAGE
$DIR/create-db $STAGE
