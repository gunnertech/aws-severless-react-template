#!/bin/bash
# ./scripts/amplify/setup.sh <developer-name>
# ./scripts/amplify/setup.sh cody
set -e
IFS='|'

DEVELOPER_NAME=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}../../"

git checkout $DEVELOPER_NAME;
cd $DIR/../serverless;
git checkout $DEVELOPER_NAME
$DIR/init.sh <project-name> dev
amplify add api
amplify add analytics
amplify add storage
$DIR/deploy.sh 

$PROJECT_HOME/scripts/setvar.sh dev-user-pool-id $(aws cognito-idp list-user-pools --max-results 1 --profile <project-name>-devdeveloper --output json --query UserPools[0].Id)
$PROJECT_HOME/scripts/setvar.sh dev-auth-role-name $(aws iam list-roles --profile <project-name>-devdeveloper --output text --query 'Roles[?ends_with(RoleName, `-authRole`) == `true`]|[0:1].RoleName')
git add .; git commit -am "amplify setup"; git checkout staging; git merge $DEVELOPER_NAME;
$DIR/init.sh <project-name> staging
$DIR/deploy.sh 
$PROJECT_HOME/scripts/setvar.sh dev-user-pool-id $(aws cognito-idp list-user-pools --max-results 1 --profile <project-name>-stagingdeveloper --output json --query UserPools[0].Id)
$PROJECT_HOME/scripts/setvar.sh dev-auth-role-name $(aws iam list-roles --profile <project-name>-stagingdeveloper --output text --query 'Roles[?ends_with(RoleName, `-authRole`) == `true`]|[0:1].RoleName')
git add .; git commit -am "amplify setup"; git checkout master; git merge staging;
$DIR/init.sh <project-name> prod
$DIR/deploy.sh 
$PROJECT_HOME/scripts/setvar.sh dev-user-pool-id $(aws cognito-idp list-user-pools --max-results 1 --profile <project-name>-proddeveloper --output json --query UserPools[0].Id)
$PROJECT_HOME/scripts/setvar.sh dev-auth-role-name $(aws iam list-roles --profile <project-name>-proddeveloper --output text --query 'Roles[?ends_with(RoleName, `-authRole`) == `true`]|[0:1].RoleName')
git add .; git commit -am "amplify setup"; git checkout $DEVELOPER_NAME