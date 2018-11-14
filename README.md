1) Add Branch to react-native-client
2) Add Sentry to react-client
3) Add Amplify to react-client
4) Add directions for creating AWS account
5) Add directions for getting this from repo
6) Clean out info from react-client


# Setup
## Project Structure
$ mkdir <project-name>

## Serverless
$ cd <project-name>
1) Copy serverless directory from another project
2) Global search for TODO (and do them)
3) Remove uneeded functions and resources

$ yarn
$ sls deploy

## React Native Client:https://github.com/react-community/create-react-native-app
$ yarn global add expo-cli
$ cd <project-name>
$ expo init <project-name>
$ mv <project-name> client (or react-native-client)

See App.js file from another project for configuring Amplify
See package.json from other project. Probably copy most, if not all to this project

$ yarn install

## React Client: https://github.com/facebook/create-react-app
$ cd <project-name>
$ yarn create react-app <project-name>
$ mv <project-name> client (or react-client)

See App.js file from another project for configuring Amplify
See package.json from other project. Probably copy most, if not all to this project

$ yarn install

## Git
$ cd <project-name>
$ git init
cp ../<other-project>/.git/config .git/
$ code .git/config

change info to match project