# Setup

## Prerequisites

Install the following

1. AWS CLI (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html#install-tool-pip)
2. Git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. NVM (https://github.com/creationix/nvm#installation-and-update)
4. Node ($ nvm install)
5. Serverless framework config (npm install -g serverless)
6. Expo (npm install -g expo-cli)
7. Our AWS scripts (https://github.com/gunnertech/aws-scripts)

## AWS account
````
$ cd ~/workspace/aws
$ ./organization add -o <client-name> -n <project-name>-development -e <project-name>-development@gunnertech.com -u <your root username> -g <groupname>
$ ./organization add -o <client-name> -n <project-name>-staging -e <project-name>-staging@gunnertech.com -u <your root username> -g <groupname>
$ ./organization add -o <client-name> -n <project-name>-production -e <project-name>-production@gunnertech.com -u <your root username> -g <groupname>
````


## Project 
````
$ cd ~/workspace/javascript/serverless
$ git clone --single-branch -b template git@github.com:gunnertech/aws-severless-react-template.git <project-name>
````

## Git


````
$ Modify project's <project-name>/.git/config with [this](https://gist.github.com/CodySwannGT/ea1dcb937426d8121576b59334000d58) and replace <project-name> and <developer-name>
$ ##Do a global search and replace for <project-name> and replace with, well, the name of the project
$ git checkout -b <developer-name>
````

## Serverless
````
$ yarn global add serverless
$ code <project-name>/serverless
$ # Global search for PRE DEPLOY TODO
$ yarn
$ sls deploy -s development
$ sls deploy -s staging
$ sls deploy -s production
$ # Global search for POST DEPLOY TODO
$ sls deploy -s development
$ sls deploy -s staging
$ sls deploy -s production
````

## [React Native Client](https://github.com/react-community/create-react-native-app)
````
$ yarn global add expo-cli
$ cd <project-name>/react-native-client
````
Modify environment.js variables
````
$ yarn install
$ yarn ios # Load the emulator to make sure everything worked
````
## [React Client](https://github.com/facebook/create-react-app)
  ````
$ cd <project-name>/react-client
````
Modify the environment variables inside the .env.&lt;stage&gt; files for each stage (development, staging, production)
````
$ yarn install
$ yarn start (to make sure everything worked)
````

### Setup

````
$ cd <project-name>
$ git checkout -b <dev name>
$ git add .; git commit -am "initial commit"; git push
$ git checkout -b staging
$ git merge <dev name>; git push
$ git checkout -b master
$ git merge <dev name>; git push
````
### Workflow
````
$ ## Start of iteration
$ git checkout master; git pull production master
$ git checkout staging; git pull staging staging
$ git checkout %dev-name i.e. ‘cody’%
$ git merge master
$ git merge staging
$ ### start repetition process
$ git checkout -b %issue-number%
$ #work work work
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
$ aws codecommit create-pull-request --title "20190326 Iteration Pull Request" --description "20190326 Iteration Pull Request" --client-request-token 20190326 --targets repositoryName=<project-name>-staging,sourceReference=20190326 --profile <project-name>-stagingdeveloper
$ ## ACCEPT pull request (after reviewing it):
$ aws codecommit merge-pull-request-by-fast-forward --pull-request-id 6 --repository-name <project-name>-staging --profile <project-name>-stagingdeveloper
````
  
## Amplify

The below create-app snippet should work, but it doesn't because of a bug with AWS not supporting CodeCommit from the cli, so log into the console and setup the deploy as seen in [this video](https://youtu.be/iql6pRyof20).

All you have to do is connect the app. The update-app command WILL work once you connect the app.

Note, you'll have to copy the environment variables from the respective .env files and update them below and do this for EACH environment

````
$ # THIS SHOULD WORK BUT IT WON'T
$ aws amplify create-app --name <project-name>-<stage> \
  --profile <project-name>-<stage>developer \
  --repository https://git-codecommit.us-east-1.amazonaws.com/v1/repos/<project-name>-<stage>/ \
  --oauth-token na \
  --platform WEB \
  --environment-variables REACT_APP_userPoolId='us-east-1_KVlHazoic',REACT_APP_identityPoolId='us-east-1:f5bf62cd-bdcf-4bcd-b728-3183a586482c',REACT_APP_awsRegion='us-east-1',REACT_APP_userPoolWebClientId='1tkd50s16cgbqq7lqi9oakvvvm',REACT_APP_aws_appsync_graphqlEndpoint='https://qhwg2bxxvvctrh6hb6xnb2rhmu.appsync-api.us-east-1.amazonaws.com/graphql',REACT_APP_bucket='com-gunnertech-<project-name>-<stage>',REACT_APP_pinpoint_app_id="26e2d1c5094b43109e3ffa350f09246a",REACT_APP_cdn='d2qjgmi918y4cs.cloudfront.net',REACT_APP_base_url="http://localhost:3000",REACT_APP_sentry_url='https://95faca7deff040e5a8336345cbef8e94@sentry.io/1429804' \
  --enable-branch-auto-build \
  --environment-variables REACT_APP_userPoolId='us-east-1_KVlHazoic',REACT_APP_identityPoolId='us-east-1:f5bf62cd-bdcf-4bcd-b728-3183a586482c',REACT_APP_awsRegion='us-east-1',REACT_APP_userPoolWebClientId='1tkd50s16cgbqq7lqi9oakvvvm',REACT_APP_aws_appsync_graphqlEndpoint='https://qhwg2bxxvvctrh6hb6xnb2rhmu.appsync-api.us-east-1.amazonaws.com/graphql',REACT_APP_bucket='com-gunnertech-<project-name>-<stage>',REACT_APP_pinpoint_app_id="26e2d1c5094b43109e3ffa350f09246a",REACT_APP_cdn='d2qjgmi918y4cs.cloudfront.net',REACT_APP_base_url="http://localhost:3000",REACT_APP_sentry_url='https://95faca7deff040e5a8336345cbef8e94@sentry.io/1429804' \
  --enable-branch-auto-build \
  --custom-rules '[{"source":"</^[^.]+$|\\.(?!(css|json|gif|ico|jpg|js|png|txt|svg|woff|ttf)$)([^.]+$)/>","target":"/index.html","status":"200"},{"source":"/<*>","target":"/index.html","status":"404"}]'
````


````
$ # THIS WILL WORK
$ aws amplify list-apps --profile <project-name>-<stage>developer ## get the app-id
$ aws amplify update-app --app-id d3vxt2imvts5g3 \
  --name <project-name>-<stage> \
  --profile <project-name>-<stage>developer \
  --platform WEB \
  --environment-variables REACT_APP_userPoolId='us-east-1_KVlHazoic',REACT_APP_identityPoolId='us-east-1:f5bf62cd-bdcf-4bcd-b728-3183a586482c',REACT_APP_awsRegion='us-east-1',REACT_APP_userPoolWebClientId='1tkd50s16cgbqq7lqi9oakvvvm',REACT_APP_aws_appsync_graphqlEndpoint='https://qhwg2bxxvvctrh6hb6xnb2rhmu.appsync-api.us-east-1.amazonaws.com/graphql',REACT_APP_bucket='com-gunnertech-<project-name>-<stage>',REACT_APP_pinpoint_app_id="26e2d1c5094b43109e3ffa350f09246a",REACT_APP_cdn='d2qjgmi918y4cs.cloudfront.net',REACT_APP_base_url="http://localhost:3000",REACT_APP_sentry_url='https://95faca7deff040e5a8336345cbef8e94@sentry.io/1429804' \
  --enable-branch-auto-build \
  --custom-rules '[{"source":"</^[^.]+$|\\.(?!(css|json|gif|ico|jpg|js|png|txt|svg|woff|ttf)$)([^.]+$)/>","target":"/index.html","status":"200"},{"source":"/<*>","target":"/index.html","status":"404"}]'
````

## Deploying (Staging)

````
$ git checkout staging
$ git pull
$ git merge master # (make sure you have the latest hotfixes)
$ git push
````

### Backend

````
$ cd serverless
$ sls deploy -s staging
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
$ aws amplify list-jobs --app-id d2x31qlfq03ed5 --branch-name staging --profile <project-name>-stagingdeveloper
````

## Deploying (Production) 

(after Client approves changes on staging)

````
$ git checkout master
$ git merge staging
$ git push
````
### Backend
````
$ cd serverless
$ sls deploy -s production
$ ### (snapshot for the program)
$ sls deploy list -s production
````
### React Native Front End
````
$ cd react-native-client
$ yarn start
$ ###if you need to build a new standalone (i.e. expo or react version changes, icon, splash changes)
$ #update version code, build numbers, etc in app.jso
$ expo build:ios --release-channel production
$ # UPLOAD .ipa  USING APPLICATION LOADER - if first time, you'll have to add it via itunes connect first
$ expo build:android --release-channel production
$ # Upload .apk to play store - if first time, you'll have to add the new app
$ ###else
$ ###end if 
$ ###(snapshot output for the program)
$ expo publish:history  --release-channel production
````
### React Front End (automatically from the git push)
````
$ aws amplify list-jobs --app-id d328azc37801vs --branch-name master --profile <project-name>-productiondeveloper
````