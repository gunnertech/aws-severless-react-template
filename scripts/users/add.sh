#!/bin/bash
# ./scripts/users/add.sh <stage> <user-name> <group-name> <role-arn>
# ./scripts/users/add.sh staging cody bts3-stagingAdmins arn:aws:iam::760422985805:role/bts4-daryOrganizationAccountAccessRole
set -e
IFS='|'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$DIR/../../

STAGE=$1
USER_NAME=$2
GROUP_NAME=$3
ACCOUNT_ID=$(aws sts get-caller-identity --profile bts4-${STAGE}developer --output text --query Account)

aws iam add-user-to-group --group-name $GROUP_NAME --user-name $USER_NAME

echo ""
echo ""
echo "Tell ${USER_NAME} to do the following:"
echo ""

VAR1=$(cat <<EndOfMessage1
Add to ~/.aws/config:

[profile <project-name>-${STAGE}developer]
role_arn = arn:aws:iam::${ACCOUNT_ID}:role/<project-name>-${STAGE}OrganizationAccountAccessRole
source_profile = default
region = us-east-1
EndOfMessage1
)

VAR2=$(cat <<EndOfMessage2
Add to ~/.aws/credentials:

[<project-name>-${STAGE}developer]
role_arn = arn:aws:iam::${ACCOUNT_ID}:role/<project-name>-${STAGE}OrganizationAccountAccessRole
source_profile = default
region = us-east-1
EndOfMessage2
)

VAR3=$(cat <<EndOfMessage3
Add to ~/.gitconfig:

[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}/"]
	UseHttpPath = true
	helper = !aws --profile <project-name>-${STAGE}developer codecommit credential-helper \$@
EndOfMessage3
)

VAR4=$(cat <<EndOfMessage4
Run from projects directory:

git clone --single-branch -b $STAGE https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}
EndOfMessage4
)


VAR5=$(cat <<EndOfMessage5
Add to <project-name>/.git/config:

[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}/"]
	UseHttpPath = true
	helper = !aws --profile <project-name>-${STAGE}developer codecommit credential-helper \$@

[remote "${STAGE}"]
	url = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}
	fetch = +refs/heads/*:refs/remotes/${STAGE}/*
	pushurl = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-${STAGE}

[branch "${STAGE}"]
	remote = ${STAGE}
	merge = refs/heads/${STAGE}
EndOfMessage5
)

VAR6="Open <project-name>/README.md and go to the Environment Setup section to complete setup"


echo $VAR1
echo ""
echo $VAR2
echo ""
echo $VAR3
echo ""
echo $VAR4
echo ""
echo $VAR5
echo ""
echo $VAR6
echo ""
echo ""




# git init

# # mkdir -p ${PROJECT_ROOT}.git/


# git checkout -b $STAGE
# git add .; git commit -am "initial commit"