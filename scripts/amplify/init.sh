#!/bin/bash
# ./scripts/amplify/init <project name> <stage>
set -e
IFS='|'

PROJECT_NAME=$1
STAGE=$2

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"${PROJECT_NAME}-${STAGE}developer\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"${PROJECT_NAME}\",\
\"envName\":\"${STAGE}\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"none\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify init \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
