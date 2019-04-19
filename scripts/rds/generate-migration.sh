#!/bin/bash
# ./scripts/rds/generate-migration.sh <name> <sql-statement>
# ./scripts/rds/generate-migration.sh create-database "create DATABASE TESTDB"
set -e
IFS='|'

SQL=$2
FILENAME=$1
TIMESTAMP=$(date +%s)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo $SQL > $DIR/../../serverless/migrations/$TIMESTAMP-$FILENAME.sql


# aws rds modify-db-cluster --db-cluster-identifier <project-name>-$STAGE-cluster --apply-immediately --enable-http-endpoint --profile <project-name>-${STAGE}developer

# aws rds-data execute-sql --db-cluster-or-instance-arn "arn:aws:rds:us-east-1:123456789000:cluster:http-endpoint-test" \
# --schema "mysql"  --aws-secret-store-arn "arn:aws:secretsmanager:us-east-1:123456789000:secret:testHttp2-AmNvc1"  \
# --region us-east-1 --sql-statements "create DATABASE TESTDB"