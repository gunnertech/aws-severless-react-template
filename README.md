# Setup
## AWS account

$ cd ~/workspace/aws
$ ./organization add -n <project-name>-development -e <project-name>-development@gunnertech.com -u <your root username> -g <groupname>
$ ./organization add -n <project-name>-staging -e <project-name>-staging@gunnertech.com -u <your root username> -g <groupname>
$ ./organization add -n <project-name>-production -e <project-name>-production@gunnertech.com -u <your root username> -g <groupname>

# add helper to ~/.gitconfig (if you haven't before - you'll also need access to the simplisurveydeveloper profile)
[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/simplisurvey/"]
UseHttpPath = true
helper = !aws --profile simplisurveydeveloper codecommit credential-helper $@



## Project 
$ cd ~/workspace/javascript/serverless
$ git clone --single-branch -b template https://git-codecommit.us-east-1.amazonaws.com/v1/repos/simplisurvey <project name>

## Serverless
$ code <project-name>/serverless
1) Global search for PRE DEPLOY TODO
$ yarn
$ sls deploy -s development
$ sls deploy -s staging
$ sls deploy -s production
2) Global search for POST DEPLOY TODO
$ sls deploy -s development
$ sls deploy -s staging
$ sls deploy -s production


## React Native Client:https://github.com/react-community/create-react-native-app
$ yarn global add expo-cli
$ cd <project-name>/react-native-client

1) Modify app.json (replace <project name>) and environment.js (set up variables) to fit your project

$ yarn upgrade
$ yarn install
$ yarn ios (to make sure everything worked)

## React Client: https://github.com/facebook/create-react-app
$ cd <project-name>/react-client

1) Modify .env.<stage> for each stage and Layout.js for meta data

$ yarn upgrade
$ yarn install
$ yarn start (to make sure everything worked)

## Git
modify <project-name>/.git/config with this: https://gist.githubusercontent.com/CodySwannGT/ea1dcb937426d8121576b59334000d58/raw/e2c22870a4c72807837fabd1f705c337bdda1358/config.txt

and replace <project name>

$ cd <project-name>
$ git checkout -b <dev name>
$ git add .; git commit -am "initial commit"; git push -u origin <dev name>
$ git checkout -b staging
$ git merge <dev name>; git push -u staging staging
$ git checkout -b master
$ git merge <dev name>; git push -u production master
$ get branch -D template

### Workflow

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
$ git push origin %dev name%
$ git branch -D %issue-number%
$ ## repeat on more issues throughout the iteration
$ git checkout -b %iteration-date (format: YYYYMMDD) %
$ git push origin %iteration-date%
$ git tag released/%iteration-date%
$ git push origin released/%iteration-date%


## Amplify

Log into the console and setup the deploy as seen in this video: https://youtu.be/iql6pRyof20


## Deploying (Staging)

$ git checkout staging
$ git merge released/<iteration-date>
$ git merge master # (make sure you have the latest hotfixes)
$ git push

### Backend
$ cd serverless
$ sls deploy -s staging

### React Native Front End
$ cd react-native-client
$ ###if you need to build a new standalone (i.e. expo or react version changes, icon, splash changes)
$ expo build:ios --release-channel staging
$ expo build:android --release-channel staging
$ ###end if
$ expo publish --release-channel staging

### React Front End (automatically from the git push)

## Deploying (Production)

### Client approves iteration
$ git checkout master
$ git merge released/<iteration-date>
$ git push
$ git branch -D <iteration-date>

### Backend
$ cd serverless
$ sls deploy -s production

### React Native Front End
$ cd react-native-client
$ expo publish --release-channel production

### React Front End (automatically from the git push)
