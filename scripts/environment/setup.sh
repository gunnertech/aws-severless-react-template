#!/bin/bash
# ./scripts/project/setup.sh <project-name> <stage> <org-name> <domain>
export LC_CTYPE=C 
export LANG=C

set -e
IFS='|'

PROJECT=$1
STAGE=$2
ORG_NAME=$3
DOMAIN=$4

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$DIR/../../

rm -rf $PROJECT_ROOT/.git
cd $PROJECT_ROOT

echo "Adding environment ${STAGE}...."
$DIR/add -o $ORG_NAME -s $STAGE -i $DOMAIN
echo "Done adding environment ${STAGE}"

echo "Configuring environment ${STAGE}...."
$DIR/configure.sh $STAGE $PROJECT
echo "Done Configuring environment ${STAGE}"

echo "Configuring git for ${STAGE}...."
$PROJECT_ROOT/scripts/git/setup.sh ${STAGE}
echo "Done Configuring git for ${STAGE}"

echo "Configuring amplify for ${STAGE}...."
$PROJECT_ROOT/scripts/amplify/setup.sh ${STAGE}
echo "Done Configuring amplify for ${STAGE}"

echo "Configuring serverless for ${STAGE}...."
$PROJECT_ROOT/scripts/serverless/setup.sh ${STAGE}
echo "Done Configuring serverless for ${STAGE}"

echo "Configuring amplify/hosting for ${STAGE}...."
$PROJECT_ROOT/scripts/amplify/hosting/setup.sh ${STAGE}
echo "Done Configuring amplify/hosting for ${STAGE}"

echo "Setting up react native client...."
cd $PROJECT_ROOT/react-native-client
yarn install
echo "Done setting up react native client"

echo "Setting up react client...."
cd $PROJECT_ROOT/react-client
yarn install
echo "Done setting up react client"