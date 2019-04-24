# Description

This project is meant to be a starter template for a serverless platform, leveraging the Serverless Framework, AWS Amplify, AWS AppSync, GraphQL, React and Expo.

# Setup

## Prerequisites

Install the following

1. Make sure you have an AWS account with proper ~/.aws/config and ~/.aws/credential files
1. Brew ``$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"``
1. Python ``$ brew install python; brew upgrade python``
1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html#install-tool-pip) or ``$ brew install awscli; brew upgrade awscli``
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
3. ``./<project-name>/scripts/setvar.sh sentry-url <url>``


## Environment
````
$ cd <project-name>
$ yarn run environment:setup <project-name> <stage> <org-name> <domain>
````

### Examples
````
$ yarn run environment:setup <project-name> cody Qualis gunnertech.com # developer specific environment
$ yarn run environment:setup <project-name> staging Qualis gunnertech.com # staging environment
$ yarn run environment:setup <project-name> prod Qualis gunnertech.com # production environment
````

## RDS Serverless SQL Database (optional)

### Setup
````
# Modify serverless/secrets.yml with a username and password
$ cd <project-name>
$ ./scripts/rds/setup.sh <stage> (cody|dary|build|staging|prod|etc)
````

### Schema Migrations and Codegen
````
$ cd <project-name>/serverless
$ yarn run rds:generate-migration <migration-name> <sql-statement>
$ yarn run rds:migrate <stage>
$ amplify env checkout <stage>
$ amplify api add-graphql-datasource
````

# Adding a Team Member
1. Dev requests access to base-stage (where pull requests are submitted, i.e. staging)
1. If approved, dev's IAM user gets added to the IAM group with access to base-stage
1. Dev must add git credentials to ~/.gitconfig
````
[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-<base-stage>/"]
	UseHttpPath = true
	helper = !aws --profile <project-name>-<base-stage>developer codecommit credential-helper $@
````

After that, the dev has access to the project and can set up a new environment for themselves

````
$ git clone --single-branch -b <base-stage> https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-<base-stage>
$ cd <project-name>
````

Add the following to the project's ~/.git/config (replacing base-stage where appropriate)

````
[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-<base-stage>/"]
	UseHttpPath = true
	helper = !aws --profile <project-name>-<base-stage>developer codecommit credential-helper $@

[remote "<base-stage>"]
	url = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-<base-stage>
	fetch = +refs/heads/*:refs/remotes/<base-stage>/*
	pushurl = https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-<base-stage>

[branch "<base-stage>"]
	remote = <base-stage>
	merge = refs/heads/<base-stage>
````

Go to [Environment Setup](#environment)


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
$ ./scripts/deploy/backend.sh <stage> (migrate) # if you need to make backend changes
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
./scripts/git/approve-pull-request.sh <current-stage> <target-stage> <iteration-end-date: (format: YYYYMMDD)>
````

## Approve pull requests

Team lead reviews and approves pull requests

````
$ ./scripts/git/setup.sh <stage> <request-id> <iteration-end-date: (format: YYYYMMDD)>
$ # repeat above for all pull requests
$ ./scripts/git/tag.sh <stage> <iteration-end-date  (format: YYYYMMDD)>
````  


## Deploying


### Backend

````
$ cd <project-name>
$ ./scripts/deploy/backend.sh <stage (staging|prod)>
````

### React Native Front End
````
$ cd <project-name>
$ ./scripts/deploy/mobile.sh <stage (staging|prod)>
````
### React Front End

````
$ cd <project-name>
$ ./scripts/deploy/web.sh <stage (staging|prod)>
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
1. Add congiration parameters for vars like project-name and base-stage
1. Script the adding of teammates