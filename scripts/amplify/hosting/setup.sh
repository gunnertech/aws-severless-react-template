#!/bin/bash
# ./scripts/amplify/hosting/setup.sh <developer-name>
# ./scripts/amplify/hosting/setup.sh cody
set -e
IFS='|'

DEVELOPER_NAME=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}../../../"
DEV_APP_ID=$(aws amplify list-apps --profile <project-name>-devdeveloper --query apps[0].appId)
$DEV_APP_ID=${DEV_APP_ID//\"}
STAGING_APP_ID=$(aws amplify list-apps --profile <project-name>-stagingdeveloper --query apps[0].appId)
$STAGING_APP_ID=${STAGING_APP_ID//\"}
PROD_APP_ID=$(aws amplify list-apps --profile <project-name>-proddeveloper --query apps[0].appId)
$PROD_APP_ID=${PROD_APP_ID//\"}

git checkout $DEVELOPER_NAME;
cd $DIR/../serverless;
$PROJECT_HOME/scripts/setvar.sh dev-app-id $DEV_APP_ID
$DIR/hosting.sh <project-name> dev $DEV_APP_ID <dev-cloudfront-domain> <sentry-url> 
git add .; git commit -am "set vars"; git push; git checkout staging; git merge $DEVELOPER_NAME
$PROJECT_HOME/scripts/setvar.sh staging-app-id $STAGING_APP_ID
$DIR/hosting.sh <project-name> staging $STAGING_APP_ID <staging-cloudfront-domain> <sentry-url>
git add .; git commit -am "set vars"; git push; git checkout master; git merge staging
$PROJECT_HOME/scripts/setvar.sh prod-app-id $PROD_APP_ID
$DIR/hosting.sh <project-name> prod $PROD_APP_ID <prod-cloudfront-domain> <sentry-url>
git add .; git commit -am "set vars"; git push; git checkout $DEVELOPER_NAME