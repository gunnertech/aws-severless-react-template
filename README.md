# Setup
## AWS account

$ cd ~/workspace/aws
$ ./organization add -n <project-name> -e <project-name>@gunnertech.com -u <your root username> -g OrganizationAdministrators
# add helper to ~/.gitconfig
[credential "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/simplisurvey/"]
UseHttpPath = true
helper = !aws --profile simplisurveydeveloper codecommit credential-helper $@



## Project 
$ cd ~/workspace/javascript/serverless
$ git clone --single-branch -b template https://git-codecommit.us-east-1.amazonaws.com/v1/repos/simplisurvey <project name>

## Serverless
$ code <project-name>/serverless
1) Global search for TODO and do the pre-deploy ones
$ yarn
$ sls deploy
2) Global search for TODO and do the post-deploy ones
$ sls deploy


## React Native Client:https://github.com/react-community/create-react-native-app
$ yarn global add expo-cli
$ cd <project-name>/react-native-client

1) Modify app.json and environment.js to fit your project
2) Global search for TODO (and do them)

$ yarn install

## React Client: https://github.com/facebook/create-react-app
$ cd <project-name>/react-client

1) Global search for TODO (and do them)


$ yarn install

## Git
modify .git/config to match project

The best way to do this is to grab the .git/config from another project and replace <example project name> with <project name>

$ cd <project-name>
$ git checkout -b master
$ git add .; git commit -am "initial commit"; git push

## Amplify

Log into the console and setup the deploy as seen in this video: https://youtu.be/iql6pRyof20