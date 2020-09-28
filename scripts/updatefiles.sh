#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
HOMEPATH="$SCRIPTPATH/.."

# watchman -f -- trigger "$HOMEPATH/amplify/" buildme '*.js' -- echo

# echo $SCRIPTPATH

# watch 'echo' ../amplify --filter="*.js" --ignoreDotFiles

#   rm -rf ${HOMEPATH}/serverless/aws-exports.js;
# cp ${HOMEPATH}/amplify/src/aws-exports.js ${HOMEPATH}/serverless/aws-exports.js;
# rm -rf ${HOMEPATH}/serverless/src/api;
# cp -R ${HOMEPATH}/amplify/src/api ${HOMEPATH}/serverless/src

SYNC="rm -rf ${HOMEPATH}/react-client/src/aws-exports.js;
  rm -rf ${HOMEPATH}/react-native-client/aws-exports.js;
  cp ${HOMEPATH}/amplify/src/aws-exports.js ${HOMEPATH}/react-client/src/aws-exports.js;
  cp ${HOMEPATH}/amplify/src/aws-exports.js ${HOMEPATH}/react-native-client/aws-exports.js;
  rm -rf ${HOMEPATH}/react-client/src/api;
  rm -rf ${HOMEPATH}/react-native-client/src/api;
  cp -R ${HOMEPATH}/amplify/src/api ${HOMEPATH}/react-client/src;
  cp -R ${HOMEPATH}/amplify/src/api ${HOMEPATH}/react-native-client/src"

# rm -rf ${HOMEPATH}/serverless/aws-exports.js;
# cp ${HOMEPATH}/amplify/src/aws-exports.js ${HOMEPATH}/serverless/aws-exports.js

SYNC_APPSYNC="rm -rf ${HOMEPATH}/react-client/src/aws-exports.js;
  rm -rf ${HOMEPATH}/react-native-client/aws-exports.js;
  cp ${HOMEPATH}/amplify/src/aws-exports.js ${HOMEPATH}/react-client/src/aws-exports.js;
  cp ${HOMEPATH}/amplify/src/aws-exports.js ${HOMEPATH}/react-native-client/aws-exports.js"

# rm -rf ${HOMEPATH}/serverless/src/api;
# cp -R ${HOMEPATH}/api ${HOMEPATH}/serverless/src

SYNC_API="rm -rf ${HOMEPATH}/react-client/src/api;
  rm -rf ${HOMEPATH}/react-native-client/src/api;
  cp -R ${HOMEPATH}/api ${HOMEPATH}/react-client/src;
  cp -R ${HOMEPATH}/api ${HOMEPATH}/react-native-client/src"

# rm -rf ${HOMEPATH}/serverless/src/react-shared;
# cp -R ${HOMEPATH}/react-shared ${HOMEPATH}/serverless/src

SYNC_SHARED="rm -rf ${HOMEPATH}/react-client/src/react-shared;
  rm -rf ${HOMEPATH}/react-native-client/src/react-shared;
  cp -R ${HOMEPATH}/react-shared ${HOMEPATH}/react-client/src;
  cp -R ${HOMEPATH}/react-shared ${HOMEPATH}/react-native-client/src"


watch "${SYNC_APPSYNC}" $HOMEPATH/amplify/src --ignoreDirectoryPattern=/\.*/  --wait=2 &
# watch "${SYNC_API}" $HOMEPATH/api  --ignoreDotFiles --wait=2 &
watch "${SYNC_SHARED}" $HOMEPATH/react-shared  --ignoreDotFiles --wait=2 &

echo $HOMEPATH