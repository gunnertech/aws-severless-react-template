# Setup
## AWS account
````
$ cd ~/workspace/aws
$ ./organization add -n <project-name>-development -e <project-name>-development@gunnertech.com -u <your root username> -g <groupname>
$ ./organization add -n <project-name>-staging -e <project-name>-staging@gunnertech.com -u <your root username> -g <groupname>
$ ./organization add -n <project-name>-production -e <project-name>-production@gunnertech.com -u <your root username> -g <groupname>
````
## add helper to ~/.gitconfig (if you haven't before - you'll also need access to the simplisurveydeveloper profile)
[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/simplisurvey/"]
UseHttpPath = true
helper = !aws --profile simplisurveydeveloper codecommit credential-helper $@



## Project 
````
$ cd ~/workspace/javascript/serverless
$ git clone --single-branch -b template https://git-codecommit.us-east-1.amazonaws.com/v1/repos/simplisurvey <project name>
````

## Serverless
````
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

## React Native Client:https://github.com/react-community/create-react-native-app
````
$ yarn global add expo-cli
$ cd <project-name>/react-native-client
````
1) Modify app.json (replace <project name>) and environment.js (set up variables) to fit your project
````
$ yarn upgrade
$ yarn install
$ yarn ios (to make sure everything worked)
````
## React Client: https://github.com/facebook/create-react-app
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
modify <project-name>/.git/config with this: https://gist.githubusercontent.com/CodySwannGT/ea1dcb937426d8121576b59334000d58/raw/e2c22870a4c72807837fabd1f705c337bdda1358/config.txt

and replace <project name>
````
$ cd <project-name>
$ git checkout -b <dev name>
$ git add .; git commit -am "initial commit"; git push -u origin <dev name>
$ git checkout -b staging
$ git merge <dev name>; git push -u staging staging
$ git checkout -b master
$ git merge <dev name>; git push -u production master
$ git branch -D template
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
$ aws codecommit create-pull-request --title "20190305 Iteration Pull Request" --description "20190305 Iteration Pull Request" --client-request-token 20190305 --targets repositoryName=simplisurvey-staging,sourceReference=20190305 --profile  simplisurvey-stagingdeveloper
````
  
## Amplify

Log into the console and setup the deploy as seen in this video: https://youtu.be/iql6pRyof20


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
````
### React Front End (automatically from the git push)

## Deploying (Production)

### Client approves iteration
````
$ git checkout master
$ git merge staging
$ git push
````
### Backend
````
$ cd serverless
$ sls deploy -s production
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
$ expo publish --release-channel production
$ ###end if 
````
### React Front End (automatically from the git push)