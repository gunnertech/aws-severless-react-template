#!/bin/bash
# ./scripts/deploy/mobile.sh <stage> <type (full|ota)>
# ./scripts/deploy/mobile.sh staging ota
# ./scripts/deploy/mobile.sh staging full
# ./scripts/deploy/mobile.sh prod ota
set -e
IFS='|'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}../../"
STAGE=$1
TYPE=$2

$DIR/common.sh

cd $PROJECT_HOME/react-native-client

if [ "$TYPE" = "full" ]; then
  echo "Starting. Are you sure you updated the build/version numbers?\n\n\n"
  expo build:ios --release-channel $STAGE
  expo build:android --release-channel $STAGE
  echo "The builds have finished, but you still need to download them and publish them to the respective app stores"
else
  expo publish --release-channel $STAGE
fi

expo publish:history  --release-channel $STAGE