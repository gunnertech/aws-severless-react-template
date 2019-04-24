#!/bin/bash
# ./scripts/serverless/setup.sh <stage>

set -e
IFS='|'

STAGE=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}/../../"

git checkout $STAGE;
cd $PROJECT_HOME/serverless;
yarn install
sls deploy -s $STAGE
$PROJECT_HOME/scripts/setvar.sh $STAGE-cloudfront-domain $(aws cloudfront list-distributions --profile <project-name>-${$STAGE}developer --output json --query DistributionList.Items[0].DomainName)
git add .; git commit -am "sets variables"; git push