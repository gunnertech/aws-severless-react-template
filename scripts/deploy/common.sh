#!/bin/bash
# ./scripts/deploy/common.sh <stage>
# ./scripts/deploy/common.sh staging
# ./scripts/deploy/common.sh prod
set -e
IFS='|'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}/../../"
STAGE=$1
BRANCH=$STAGE



git checkout $BRANCH
cd $PROJECT_HOME/serverless;
amplify env checkout $STAGE
