#!/bin/bash
# ./scripts/serverless/setup.sh $DEVELOPER_NAME
# ./scripts/serverless/setup.sh cody
set -e
IFS='|'

DEVELOPER_NAME=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}../../"

git checkout $DEVELOPER_NAME;
cd $PROJECT_HOME/serverless;
yarn install
sls deploy -s dev
$PROJECT_HOME/scripts/setvar.sh dev-cloudfront-domain $(aws cloudfront list-distributions --profile <project-name>-devdeveloper --output json --query DistributionList.Items[0].DomainName)
git add .; git commit -am "sets variables"; git push
git checkout staging; git merge $DEVELOPER_NAME
sls deploy -s staging
$PROJECT_HOME/scripts/setvar.sh staging-cloudfront-domain $(aws cloudfront list-distributions --profile <project-name>-stagingdeveloper --output json --query DistributionList.Items[0].DomainName)
git add .; git commit -am "sets variables"; git push
git checkout master; git merge staging
sls deploy -s prod
$PROJECT_HOME/scripts/setvar.sh prod-cloudfront-domain $(aws cloudfront list-distributions --profile <project-name>-proddeveloper --output json --query DistributionList.Items[0].DomainName)
git add .; git commit -am "sets variables"; git push
git checkout $DEVELOPER_NAME
