#!/bin/bash
# ./scripts/rds/create-db.sh <stage>
# ./scripts/rds/create-db.sh dev
set -e
IFS='|'

STAGE=$1
ACCOUNT_ID=$(aws sts get-caller-identity --profile <project-name>-${STAGE}developer --output text --query Account)
DATABASE_NAME=<project-name>_${STAGE}_db

aws rds-data execute-sql --db-cluster-or-instance-arn "arn:aws:rds:us-east-1:$ACCOUNT_ID:cluster:<project-name>-$STAGE-cluster" \
    --schema "mysql"  --aws-secret-store-arn "HttpRDSSecret"  \
    --region us-east-1 --sql-statements "create DATABASE $DATABASE_NAME" \
    --profile <project-name>-${STAGE}developer