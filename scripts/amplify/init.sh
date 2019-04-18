#!/bin/bash
# ./scripts/amplify/init <project name> <env>
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"$1-$2developer\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"$1\",\
\"envName\":\"$2\",\
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