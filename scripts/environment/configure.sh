#!/bin/bash
# ./scripts/environment/configure.sh <stage> <project>
export LC_CTYPE=C 
export LANG=C

set -e
IFS='|'
STAGE=$1
PROJECT=$2
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


REACT_NATIVE_TEMPLATE=$(awk 'FNR==NR{s=(!s)?$0:s RS $0;next} /\/\/<new-environment>/{sub(/\/\/<new-environment>/, s)} 1' ${DIR}/../templates/environment.js.txt $DIR/../../react-native-client/src/environment.js | sed "s/<stage>/${STAGE}/g")
SERVERLESS_TEMPLATE=$(awk 'FNR==NR{s=(!s)?$0:s RS $0;next} /#<new-environment>/{sub(/#<new-environment>/, s)} 1' ${DIR}/../templates/env.yml.txt $DIR/../../serverless/env.yml | sed "s/<stage>/${STAGE}/g")
GIT_TEMPLATE=$(awk 'FNR==NR{s=(!s)?$0:s RS $0;next} /#<new-environment>/{sub(/#<new-environment>/, s)} 1' ${DIR}/../templates/git.txt $DIR/../../.git/config | sed "s/<stage>/${STAGE}/g" | sed "s/<project-name>/${PROJECT}/g")
SECRETS_FILE=$DIR/../../serverless/secrets.yml

if [ -f "$SECRETS_FILE" ]; then
  SECRETS_TEMPLATE=$(awk 'FNR==NR{s=(!s)?$0:s RS $0;next} /#<new-environment>/{sub(/#<new-environment>/, s)} 1' ${DIR}/../templates/secrets.yml.txt $DIR/../../serverless/secrets.yml | sed "s/<stage>/${STAGE}/g")
  echo $SECRETS_TEMPLATE > $DIR/../../serverless/secrets.yml
else
  cp ${DIR}/../templates/secrets.yml.txt $DIR/../../serverless/secrets.yml
  sed -i "" "s/<stage>/${STAGE}/g" $DIR/../../serverless/secrets.yml
fi


echo $REACT_NATIVE_TEMPLATE > $DIR/../../react-native-client/src/environment.js
echo $SERVERLESS_TEMPLATE > $DIR/../../serverless/env.yml
echo $GIT_TEMPLATE > $DIR/../../.git/config

cp ${DIR}/../templates/.env.stage.txt $DIR/../../react-client/.env.${STAGE}

sed -i "" "s/<stage>/${STAGE}/g" $DIR/../../react-client/.env.${STAGE}