#!/bin/bash
# ./scripts/rds/migrate.sh <stage>
# ./scripts/rds/migrate.sh dev
set -e
IFS='|'

STAGE=$1
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ACCOUNT_ID=$(aws sts get-caller-identity --profile <project-name>-${STAGE}developer --output text --query Account)
DATABASE_NAME=<project-name>_${STAGE}_db
mkdir -p $DIR/../../serverless/migrations/
FILES=$DIR/../../serverless/migrations/*

for f in $FILES
do
  echo "Processing $f migration..."

  value=`cat $f`
  aws rds-data execute-sql --db-cluster-or-instance-arn "arn:aws:rds:us-east-1:$ACCOUNT_ID:cluster:<project-name>-$STAGE-cluster" \
    --schema "mysql"  --aws-secret-store-arn "HttpRDSSecret"  \
    --region us-east-1 --sql-statements "$value" --database "$DATABASE_NAME" \
    --profile <project-name>-${STAGE}developer || true
    
done

# echo $SQL > $DIR/../../serverless/migrations


# aws rds modify-db-cluster --db-cluster-identifier <project-name>-$STAGE-cluster --apply-immediately --enable-http-endpoint --profile <project-name>-${STAGE}developer

