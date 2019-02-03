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

$ yarn install
$ yarn ios (to make sure everything worked)

## React Client: https://github.com/facebook/create-react-app
$ cd <project-name>/react-client

1) Modify .env.<stage> for each stage and Layout.js for meta data

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

## Amplify

Log into the console and setup the deploy as seen in this video: https://youtu.be/iql6pRyof20