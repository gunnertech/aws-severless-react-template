# Setup
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
$ ##Do a global search and replace for <project-name> and replace with, well, the name of the project
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
1) Modify .env.<stage> for each stage and Layout.js for meta data
````
$ yarn upgrade
$ yarn install
$ yarn start (to make sure everything worked)
````
## Git
Modify project's <project-name>/.git/config with [this](https://gist.github.com/CodySwannGT/ea1dcb937426d8121576b59334000d58) and replace project-name

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

Log into the console and setup the deploy as seen in [this video](https://youtu.be/iql6pRyof20)


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