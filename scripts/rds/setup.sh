#!/bin/bash
# ./scripts/rds/setup.sh
# ./scripts/rds/setup.sh
set -e
IFS='|'

DEVELOPER_NAME=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_HOME="${DIR}../../"

git checkout $DEVELOPER_NAME;
cd $PROJECT_HOME/serverless;


sls deploy -s dev
$DIR/enable-api dev
$DIR/create-db dev
sls deploy -s staging
$DIR/enable-api staging
$DIR/create-db staging
sls deploy -s prod
$DIR/enable-api prod
$DIR/create-db prod