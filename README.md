1) Add Branch to react-native-client -> can't do this until after the app is approved in app stores


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
$ git clone --single-branch -b template https://git-codecommit.us-east-1.amazonaws.com/v1/repos/simplisurvey
$ mv simplisurvey <project-name>

## Serverless
$ cd <project-name>
1) Copy serverless directory from another project
2) Global search for TODO (and do them)

$ yarn
$ sls deploy

## React Native Client:https://github.com/react-community/create-react-native-app
$ yarn global add expo-cli
$ cd <project-name>
$ expo init <project-name>
$ mv <project-name> client (or react-native-client)

Modify app.json and environment.js to fit your project
Global search for TODO (and do them)

$ yarn install

## React Client: https://github.com/facebook/create-react-app
$ cd <project-name>
$ yarn create react-app <project-name>
$ mv <project-name> client (or react-client)

Global search for TODO (and do them)
change .env.* info to match your project


$ yarn install

## Git
modify .git/config to match project