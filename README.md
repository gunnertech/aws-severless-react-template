# Description

This project is meant to be a starter template for a serverless platform, leveraging the Serverless Framework, AWS Amplify, AWS AppSync, GraphQL, React and Expo.

If you see "project-name" peppered throughout the README, you are reading the template version, which is fine for reference, but make sure to [Run the AWS scripts](https://github.com/gunnertech/aws-scripts) which will customize this README as well as the code in the starter template.

#### ``*****``This guide will only work if you run those scripts first``*****``

Also, please be aware, this will only work on macOS currently. We have plans to change the scripts to be OS agnostic, but we're a Mac shop, so if anyone out there wants to help us out, awesome.


# Setup

## Prerequisites

Install the following

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
1. [Run the AWS scripts](https://github.com/gunnertech/aws-scripts) if you haven't already


## Sentry
1. [Create a new project](https://sentry.io/organizations/gunner-technology/projects/new/)
2. Note the url (i.e. https://xxxxxxxxx@sentry.io/xxxxx)
3. ``./scripts/setvar.sh sentry-url <url>``

## Git

````
$ cd <project-name>
$ ./scripts/git/setup.sh <developer-name>
````

## Amplify CLI

````
$ cd <project-name>
$ ./scripts/amplify/setup.sh <developer-name>
````

## Serverless
````
$ cd <project-name>
$ ./scripts/serverless/setup.sh <developer-name>
````


## Amplify Hosting

There is a bug with the aws cli which prevents us from completing setting up a new CI App headlessly, so we'll have to log into the console for now (ugh!).

Log into the console and setup the deploy as seen in [this video](https://youtu.be/iql6pRyof20) for each stage (dev, staging, prod)

````
$ cd <project-name>
$ ./scripts/amplify/hosting/setup.sh <developer-name>
````

## React Native Client
````
$ cd <project-name>/serverless
$ yarn watch
$ cd <project-name>/react-native-client
$ yarn install
$ yarn ios # Load the emulator to make sure everything worked
````

## React Client
````
$ cd <project-name>/serverless
$ yarn watch
$ cd <project-name>/react-client
$ yarn install
$ yarn start # open the local site to make sure everything worked
````

## RDS Serverless SQL Database (optional)

### Setup
````
# Modify serverless/secrets.yml with a username and password
$ cd <project-name>
$ ./scripts/rds/setup.sh
````

### Modifications
````
$ cd <project-name>/serverless
$ yarn run rds:generate-migration -- <migration-name> <sql-statement>
$ yarn run rds:migrate -- dev
$ amplify env checkout dev
$ amplify api add-graphql-datasource
````

# Adding a Team Member
TODO



# Workflow
````
$ ## Start of iteration
$ cd <project-name>/serverless
$ yarn watch
$ git checkout master; git pull
$ git checkout staging; git pull
$ git checkout <developer-name>
$ amplify env checkout dev
$ git merge master
$ git merge staging
$ ### start repetition process
$ git checkout -b <issue-number>
$ #work work work
$ #IF have_to_make_backend_changes
$ cd <project-name>/serverless
$ sls deploy -s dev
$ yarn run amplify:deploy
$ yarn run rds:migrate  -- dev #only if using RDS
$ #END IF
$ git add .; git commit -am “closes #<issue-number>”
$ git checkout <developer-name>
$ git merge <issue-number>
$ git push
$ git branch -D <issue-number>
$ ## repeat on more issues throughout the iteration
$ git checkout -b <iteration-date> (format: YYYYMMDD) %
$ git merge <developer-name>
$ git push origin <iteration-date>
$ git tag released/<iteration-date>
$ git push origin released/<iteration-date>
$ git push staging <iteration-date>
$ git checkout <developer-name>
$ git branch -D <iteration-date>
$ ## Submit pull request:
$ aws codecommit create-pull-request --title "<iteration-date> Iteration Pull Request" --description "<iteration-date> Iteration Pull Request" --client-request-token <iteration-date> --targets repositoryName=<project-name>-staging,sourceReference=<iteration-date> --profile <project-name>-stagingdeveloper
$ ## ACCEPT pull request (after reviewing it):
$ aws codecommit merge-pull-request-by-fast-forward --pull-request-id <request-id> --repository-name <project-name>-staging --profile <project-name>-stagingdeveloper
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
1. Document how to add a team member / environment to an existing project
1. Make setup scripts OS agnostic
1. Document optional settings and resources (i.e. Guest User, etc)
1. Put in generic Gunner Tech branding instead of SimpliSurvey
1. Convert .sh scripts to node scripts (JAVASCRIPT ALL THE THINGS!)
1. Make sentry optional