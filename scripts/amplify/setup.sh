#!/bin/bash
# ./scripts/amplify/setup.sh <stage>
# ./scripts/amplify/setup.sh cody
# ./scripts/amplify/setup.sh staging
# ./scripts/amplify/setup.sh prod
set -e
IFS='|'

STAGE=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}/../../"

git checkout $STAGE;
cd $PROJECT_HOME/serverless;
$DIR/init.sh <project-name> $STAGE
amplify add api || true
amplify add auth || true
amplify add analytics || true
amplify add storage || true
$DIR/deploy.sh 

$PROJECT_HOME/scripts/setvar.sh $STAGE-user-pool-id $(aws cognito-idp list-user-pools --max-results 1 --profile <project-name>-${STAGE}developer --output json --query UserPools[0].Id)
$PROJECT_HOME/scripts/setvar.sh $STAGE-auth-role-name $(aws iam list-roles --profile <project-name>-${STAGE}developer --output text --query 'Roles[?ends_with(RoleName, `-authRole`) == `true`]|[0:1].RoleName')


git add .; git commit -am "amplify setup";