#!/bin/bash
# ./scripts/amplify/hosting/setup.sh <stage> <sentry_url>
# ./scripts/amplify/hosting/setup.sh cody
# ./scripts/amplify/hosting/setup.sh staging
# ./scripts/amplify/hosting/setup.sh prod
set -e
IFS='|'

STAGE=$1
SENTRY_URL=$2
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}/../../../"
APP_ID=$(aws amplify list-apps --profile <project-name>-${STAGE}developer --query apps[0].appId)
CLOUD_FRONT_DOMAIN=$(aws cloudfront list-distributions --profile <project-name>-${STAGE}developer --output json --query DistributionList.Items[0].DomainName)

git checkout $STAGE;
cd $DIR/../serverless;
$PROJECT_HOME/scripts/setvar.sh $STAGE-app-id $APP_ID
$DIR/configure.sh <project-name> $STAGE $APP_ID $CLOUD_FRONT_DOMAIN $SENTRY_URL

git add .; git commit -am "set vars"; git push; git checkout $DEVELOPER_NAME