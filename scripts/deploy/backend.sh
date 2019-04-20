#!/bin/bash
# ./scripts/deploy/backend.sh <stage> (migrate optional)
# ./scripts/deploy/backend.sh staging migrate
# ./scripts/deploy/backend.sh prod migrate
# ./scripts/deploy/backend.sh staging
set -e
IFS='|'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}../../"
STAGE=$1


$DIR/common.sh

cd $PROJECT_HOME/serverless
 
sls deploy -s $STAGE
yarn run amplify:deploy

if [ $# -e 2 ]; then
   yarn run rds:migrate -- $STAGE
fi

sls deploy list -s $STAGE