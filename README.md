# Setup

## Prerequisites

Install the following

1. AWS CLI (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html#install-tool-pip)
2. Git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. NVM (https://github.com/creationix/nvm#installation-and-update)
4. Node ``nvm install``
5. Serverless framework config ``npm install -g serverless --latest``
6. Expo ``npm install -g expo-cli --latest``
7. Our AWS scripts (https://github.com/gunnertech/aws-scripts)
8. Amplify ``npm install -g @aws-amplify/cli --latest``

## AWS Accounts
````
$ cd ~/workspace/aws
$ ./organization add -o <client-name> -n <project-name>-dev -e <project-name>-dev@gunnertech.com
$ ./organization add -o <client-name> -n <project-name>-staging -e <project-name>-staging@gunnertech.com
$ ./organization add -o <client-name> -n <project-name>-prod -e <project-name>-prod@gunnertech.com
````


## Project 
````
$ cd ~/workspace/aws
$ ./project.sh <project-name> <client-name> <developer-name> (destination)
````

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
At this point, you should be looking at the README.md inside the newly created project, NOT the generic README from the template
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

## Git

````
$ git checkout -b <developer-name>
$ git add .; git commit -am "initial commit"; git push
$ git checkout -b staging
$ git merge <developer-name>; git push
$ git checkout -b master
$ git merge <developer-name>; git push
````

## Sentry
1. [Create a new project](https://sentry.io/organizations/gunner-technology/projects/new/)
2. Copy the given url (i.e. https://xxxxxxxxx@sentry.io/xxxxx) to .env.dev, .env.staging, .env.prod and environment.js and set ``<sentry url>`` in this readme

## Amplify CLI

````
$ cd <project-name>/serverless
$ yarn run amplify:init -- <project-name> dev
#### The following will run you through prompts. Make sure you understand what they mean
$ amplify add api
$ amplify add auth
$ amplify add analytics
$ amplify add storage
$ git checkout -b staging
$ yarn run amplify:init -- <project-name> staging
$ git checkout -b master
$ yarn run amplify:init -- <project-name> prod
````

## Serverless
````
$ cd <project-name>/serverless
$ yarn
$ sls deploy -s dev # copy CdnDomainName to environment.js and .env.dev and set <dev cloudfront domain> in this readme
$ sls deploy -s staging # copy CdnDomainName to environment.js and .env.staging and set <staging cloudfront domain> in this readme
$ sls deploy -s prod # copy CdnDomainName to environment.js and .env.production and set <prod cloudfront domain> in this readme
````


## Amplify Hosting

Log into the console and setup the deploy as seen in [this video](https://youtu.be/iql6pRyof20) for each stage (dev, staging, prod)

````
$ cd <project-name>/serverless
$ aws amplify list-apps --profile <project-name>-devdeveloper 
$ # copy app-id to environment.js and .env.dev and set <dev app id> in this readme
$ yarn run amplify:hosting -- <project-name> dev <dev app id> <dev cloudfront domain> <sentry url>
$ aws amplify list-apps --profile <project-name>-stagingdeveloper 
$ # copy app-id to environment.js and .env.staging and set <staging app id> in this readme
$ yarn run amplify:hosting -- <project-name> staging <staging app id> <staging cloudfront domain> <sentry url>
$ aws amplify list-apps --profile <project-name>-proddeveloper ## get the app-id
$ # copy app-id to environment.js and .env.prod and set <prod app id> in this readme
$ yarn run amplify:hosting -- <project-name> prod <prod app id> <prod cloudfront domain> <sentry url>
````


## [React Native Client](https://github.com/react-community/create-react-native-app)
````
$ cd <project-name>/react-native-client
$ yarn install
$ yarn ios # Load the emulator to make sure everything worked
````

## [React Client](https://github.com/facebook/create-react-app)
  ````
$ cd <project-name>/react-client
$ yarn install
$ yarn start # open the local site to make sure everything worked
````


# Adding a team member
TODO



# Workflow
````
$ ## Start of iteration
$ git checkout master; git pull prod master
$ git checkout staging; git pull staging staging
$ git checkout %dev-name i.e. ‘cody’%
$ git merge master
$ git merge staging
$ ### start repetition process
$ git checkout -b %issue-number%
$ #work work work
$ #IF have_to_make_backend_changes
$ cd <project-name>/serverless
$ sls deploy -s dev
$ yarn run amplify:deploy
$ git add .; git commit -am “closes #%issue-number%”
$ git checkout %dev name%
$ git merge %issue-number%
$ git push
$ git branch -D %issue-number%
$ ## repeat on more issues throughout the iteration
$ git checkout -b %iteration-date (format: YYYYMMDD) %
$ git merge %dev name%
$ git push origin %iteration-date%
$ git tag released/%iteration-date%
$ git push origin released/%iteration-date%
$ git push staging %iteration-date%
$ git checkout %dev name%
$ git branch -D <iteration-date>
$ ## Submit pull request:
$ aws codecommit create-pull-request --title "<iteration-date> Iteration Pull Request" --description "<iteration-date> Iteration Pull Request" --client-request-token <iteration-date> --targets repositoryName=<project-name>-staging,sourceReference=<iteration-date> --profile <project-name>-stagingdeveloper
$ ## ACCEPT pull request (after reviewing it):
$ aws codecommit merge-pull-request-by-fast-forward --pull-request-id <request-id> --repository-name <project-name>-staging --profile <project-name>-stagingdeveloper
````
  


## Deploying (Staging)

````
$ git checkout staging
$ amplify env checkout staging
$ git pull
$ git merge master # (make sure you have the latest hotfixes)
$ git push
````

### Backend

````
$ cd serverless
$ sls deploy -s staging
$ yarn run amplify:deploy
$ ### (snapshot for the program)
$ sls deploy list -s staging
````

### React Native Front End
````
$ cd react-native-client
$ yarn start
$ ###if you need to build a new standalone (i.e. expo or react version changes, icon, splash changes)
$ #update version code, build numbers, etc in app.json
$ expo build:ios --release-channel staging
$ # UPLOAD .ipa USING APPLICATION LOADER - if first time, you'll have to add it via itunes connect first
$ expo build:android --release-channel staging
$ # Upload .apk to play store - if first time, you'll have to add the new app
$ ###else
$ expo publish --release-channel staging
$ ###end if
$ ###(snapshot output for the program)
$ expo publish:history  --release-channel staging
````
### React Front End (automatically from the git push)

````
$ ###(snapshot output for the program)
$ aws amplify list-jobs --app-id <staging app id> --branch-name staging --profile <project-name>-stagingdeveloper
````

## Deploying (Production) 

(after Client approves changes on staging)

````
$ git checkout master
$ amplify env checkout prod
$ git merge staging
$ git push
````
### Backend
````
$ cd serverless
$ sls deploy -s prod
$ yarn run amplify:deploy
$ ### (snapshot for the program)
$ sls deploy list -s prod
````
### React Native Front End
````
$ cd react-native-client
$ yarn start
$ ###if you need to build a new standalone (i.e. expo or react version changes, icon, splash changes)
$ #update version code, build numbers, etc in app.json
$ expo build:ios --release-channel prod
$ # UPLOAD .ipa  USING APPLICATION LOADER - if first time, you'll have to add it via itunes connect first
$ expo build:android --release-channel prod
$ # Upload .apk to play store - if first time, you'll have to add the new app
$ ###else
$ ###end if 
$ ###(snapshot output for the program)
$ expo publish:history  --release-channel prod
````
### React Front End (automatically from the git push)
````
$ aws amplify list-jobs --app-id <prod app id> --branch-name master --profile <project-name>-proddeveloper
````