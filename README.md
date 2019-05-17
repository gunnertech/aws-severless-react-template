# Description

This project is meant to be a starter template for a serverless platform, leveraging the Serverless Framework, AWS Amplify, AWS AppSync, GraphQL, React and Expo.

# Setup

## Prerequisites

Install the following

1. Brew ``$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"``
1. Python ``$ brew install python; brew upgrade python``
1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html#install-tool-pip) or ``$ brew install awscli; brew upgrade awscli``
1. Setup your aws cli ``aws configure``
1. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
1. [NVM](https://github.com/creationix/nvm#installation-and-update)
1. Node ``nvm install``
1. Yarn ``brew install yarn; brew upgrade yarn;``
1. Serverless framework config ``yarn global add serverless``
1. Expo ``yarn global add expo-cli``
1. Amplify ``yarn global add @aws-amplify/cli``


## Project
````
$ curl -s https://gist.githubusercontent.com/CodySwannGT/674a5a93cbbeceffe9f67aa060cc0c6e/raw/d87d5dec3266535321417a068b5173cb93eefe04/gunnerfy.sh | bash /dev/stdin <project-name>
````

### Example
````
$ curl -s https://gist.githubusercontent.com/CodySwannGT/674a5a93cbbeceffe9f67aa060cc0c6e/raw/d87d5dec3266535321417a068b5173cb93eefe04/gunnerfy.sh | bash /dev/stdin my-cool-project
````

## Sentry
When you create the project in sentry, make sure you use ``<project-name>`` as the project name

1. [Create a new project](https://sentry.io/organizations/gunner-technology/projects/new/)
2. Note the url (i.e. https://xxxxxxxxx@sentry.io/xxxxx)
3. ``yarn setvar sentry-url <url>``


## Environment
````
$ yarn environment:setup <project-name> <stage> <org-name> <domain>
````

### Examples
````
$ yarn environment:setup <project-name> cody Qualis gunnertech.com # developer specific environment
$ yarn environment:setup <project-name> staging Qualis gunnertech.com # staging environment
$ yarn environment:setup <project-name> prod Qualis gunnertech.com # production environment
````

## RDS Serverless SQL Database (optional)

### Setup
````
$ # Modify serverless/secrets.yml with a username and password for the appropriate stage
$ yarn rds:setup <stage> (cody|dary|build|staging|prod|etc)
````

### Schema Migrations and Codegen
````
$ cd <project-name>/serverless
$ yarn rds:generate-migration <migration-name> <sql-statement>
$ yarn rds:migrate <stage>
$ amplify env checkout <stage>
$ amplify api add-graphql-datasource
````

# Adding a Team Member
1. Dev requests access to ``<base-stage>`` (where pull requests are submitted, i.e. staging) with their IAM ``<user-name>``

1. If approved, team lead will add dev's IAM user to the IAM group with access to base-stage

````
$ # find the <group-name> i.e. bts3-stagingAdmins
$ aws iam list-groups 
$ # find the role i.e. arn:aws:iam::760422985805:role/bts4-daryOrganizationAccountAccessRole
$ aws iam list-roles --max-items 1000 --profile <project-name>-<stage>developer
$ yarn users:add <base-stage> <user-name> <group-name> <role-arn>
$ # email the output of the script to the developer so they can complete setup
````


# Workflow

## Running Locally

### Backend 

````
$ cd <project-name>/serverless
$ yarn watch
````

### React Client 

````
$ cd <project-name>/react-client
$ yarn start
````

### React Native Client 

````
$ cd <project-name>/react-native-client
$ yarn <simulator> (ios|android)
````

## Start of iteration
````
$ git checkout <base-stage (staging|prod)>; git pull; # this makes sure you have the latest code
$ git checkout <stage>; git merge <base-stage>
$ amplify env checkout <stage>
````

## Work on issues
````
$ git checkout -b <issue-number>
$ # work work work
$ yarn deploy:backend <stage> (migrate) # if you need to make backend changes
$ git add .; git commit -am “closes #<issue-number>”
$ git checkout <stage>
$ git merge <issue-number>
$ git push
$ git branch -D <issue-number>
$ # Repeat on all issues assigned
````

## Submit pull request

Each developer on the project will submit a pull request

````
$ yarn git:submit <stage> <target-stage> <iteration-end-date: (format: YYYYMMDD)>
````

## Approve pull requests

Team lead reviews and approves pull requests

````
$ yarn git:approve <stage> <request-id> <iteration-end-date: (format: YYYYMMDD)>
$ # repeat above for all pull requests
$ yarn git:tag <stage> <iteration-end-date  (format: YYYYMMDD)>
````  


## Deploying


### Backend

````
$ yarn deploy:backend <stage> 
````

### React Native Front End
````
$ yarn deploy:mobile <stage>
````
### React Front End

````
$ yarn deploy:web <stage>
````


# Recommended Material
1. [Amplify GraphQL](https://aws-amplify.github.io/docs/cli/graphql)
2. [Amplify Workflow](https://aws-amplify.github.io/docs/cli/multienv?sdk=js)
3. [Amplify VSCode Extension](https://github.com/aws-amplify/amplify-js/wiki/VS-Code-Snippet-Extension#full-code-block-snippet-documentation)
4. [Amplify with AppSync](https://aws-amplify.github.io/docs/js/api#aws-appsync-sdk)
5. [Serverless Framework Docs](https://serverless.com/framework/docs/providers/aws/guide/quick-start/)
6. [AWS CloudFormation Docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html)
7. [Gunner Technology Walkthrough](https://www.youtube.com/playlist?list=PLQBYTfA46mzjBNcJiCAny3-EWRs0c1wl_)
8. [AppSync with Aurora](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-rds-resolvers.html#create-database-and-table)

# Gotchas

## DynamoDB

### One index at a time

DynamoDB will not let you create or delete two GSIs at the same time and for some reason, CloudFormation isn't smart enough to wait and do them sequentially.

This is especially problematic with the @connection directive

Try using this snippet before deploying new indexes to make sure the coast is clear:

````
$ aws dynamodb describe-table --table-name <table-name> --query Table.GlobalSecondaryIndexes[*].IndexStatus --profile <profile>
````

If everything is "ACTIVE", you're safe to deploy

## Accounts

If you want to delete an account, simply close the account.

However, you should also remove the IAM Group and IAM Policy in the main account as well

# TODO

1. Refactor all serverless variables inside the Resource block in serverless.yml into Parameters and Refs
1. Add Branch integration
1. Make setup scripts OS agnostic
1. Document optional settings and resources (i.e. Guest User, etc)
1. Put in generic Gunner Tech branding instead of SimpliSurvey
1. Convert .sh scripts to node scripts (JAVASCRIPT ALL THE THINGS!)
1. Make sentry optional
1. Add view generators
1. Add route generators
1. Add congiration parameters for vars like project-name and base-stage so they aren't search/replace
1. Move scripting to CloudFormation custom resources and macros
1. Allow sql migrations to have an up and a down