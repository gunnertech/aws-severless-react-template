# Setup

## Prerequisites

Install the following

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html#install-tool-pip)
2. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. [NVM](https://github.com/creationix/nvm#installation-and-update)
4. Node ``nvm install``
5. Serverless framework ``npm install -g serverless --latest``
6. Expo ``npm install -g expo-cli --latest``
7. Amplify ``npm install -g @aws-amplify/cli --latest``
8. [Run the AWS scripts](https://github.com/gunnertech/aws-scripts)


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
1. [Create a new project](https://sentry.io/organizations/gunner-technology/projects/new/) - make sure to use ``"<project-name>"`` when setting it up!
2. Note the url (i.e. https://xxxxxxxxx@sentry.io/xxxxx)
3. ``$ ./scripts/setvar.sh sentry-url <url>``

## Amplify CLI

````
$ cd <project-name>/serverless
$ yarn run amplify:init -- <project-name> dev
$ yarn run amplify:deploy

#### The following will run you through prompts. [Make sure you understand what they mean](https://aws-amplify.github.io/docs/js/start)
#### We deploy after each one because there are certain bugs with the cli still
$ amplify add api
$ yarn run amplify:deploy
$ amplify add auth
$ yarn run amplify:deploy
$ amplify add analytics
$ yarn run amplify:deploy
$ amplify add storage
$ yarn run amplify:deploy
$ aws cognito-idp list-user-pools --max-results 1 --profile <project-name>-devdeveloper | grep "Id"
$ ./scripts/setvar.sh dev-user-pool-id <Id>
$ aws iam list-roles --profile <project-name>-devdeveloper | grep RoleName.*-authRole
$ ./scripts/setvar.sh dev-auth-role-name <RoleName>
$ git checkout -b staging
$ yarn run amplify:init -- <project-name> staging
$ yarn run amplify:deploy
$ aws cognito-idp list-user-pools --max-results 1 --profile <project-name>-stagingdeveloper | grep "Id"
$ ./scripts/setvar.sh staging-user-pool-id <Id>
$ aws iam list-roles --profile <project-name>-stagingdeveloper | grep RoleName.*-authRole
$ ./scripts/setvar.sh staging-auth-role-name <RoleName>
$ git checkout -b master
$ yarn run amplify:init -- <project-name> prod
$ yarn run amplify:deploy
$ aws cognito-idp list-user-pools --max-results 1 --profile <project-name>-proddeveloper | grep "Id"
$ ./scripts/setvar.sh prod-user-pool-id <Id>
$ aws iam list-roles --profile <project-name>-proddeveloper | grep RoleName.*-authRole
$ ./scripts/setvar.sh prod-auth-role-name <RoleName>
````

## Serverless
````
$ cd <project-name>/serverless
$ yarn
$ sls deploy -s dev
$ ./scripts/setvar.sh dev-cloudfront-domain <CdnDomainName>
$ sls deploy -s staging
$ ./scripts/setvar.sh staging-cloudfront-domain <CdnDomainName>
$ sls deploy -s prod
$ ./scripts/setvar.sh prod-cloudfront-domain <CdnDomainName>
````


## Amplify Hosting

Log into the console and setup the deploy as seen in [this video](https://youtu.be/iql6pRyof20) for each stage (dev, staging, prod)

````
$ cd <project-name>/serverless
$ aws amplify list-apps --profile <project-name>-devdeveloper
$ ./scripts/setvar.sh dev-app-id <app-id> 
$ yarn run amplify:hosting -- <project-name> dev <dev-app-id> <dev-cloudfront-domain> <sentry-url> 
$ aws amplify list-apps --profile <project-name>-stagingdeveloper 
$ ./scripts/setvar.sh staging-app-id <app-id>
$ yarn run amplify:hosting -- <project-name> staging <staging-app-id> <staging-cloudfront-domain> <sentry-url>
$ aws amplify list-apps --profile <project-name>-proddeveloper
$ ./scripts/setvar.sh prod-app-id <app-id>
$ yarn run amplify:hosting -- <project-name> prod <prod-app-id> <prod-cloudfront-domain> <sentry-url>
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


# Adding a Team Member
TODO



# Workflow
````
$ ## Start of iteration
$ git checkout master; git pull prod master
$ git checkout staging; git pull staging staging
$ git checkout <developer-name>
$ git merge master
$ git merge staging
$ ### start repetition process
$ git checkout -b <issue-number>
$ #work work work
$ #IF have_to_make_backend_changes
$ cd <project-name>/serverless
$ sls deploy -s dev
$ yarn run amplify:deploy
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
$ aws amplify list-jobs --app-id <staging-app-id> --branch-name staging --profile <project-name>-stagingdeveloper
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
$ aws amplify list-jobs --app-id <prod-app-id> --branch-name master --profile <project-name>-proddeveloper
````

# Recommended Reading
1. [Amplify GraphQL](https://aws-amplify.github.io/docs/cli/graphql)
2. [Amplify Workflow](https://aws-amplify.github.io/docs/cli/multienv?sdk=js)
3. [Amplify VSCode Extension](https://github.com/aws-amplify/amplify-js/wiki/VS-Code-Snippet-Extension#full-code-block-snippet-documentation)
4. [Amplify with AppSync](https://aws-amplify.github.io/docs/js/api#aws-appsync-sdk)
5. [Serverless Framework Docs](https://serverless.com/framework/docs/providers/aws/guide/quick-start/)
6. [AWS CloudFormation Docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html)

# TODO

1. Refactor all serverless variables inside the Resource block in serverless.yml into Parameters and Refs
2. Add integration with Serverless Auroa via serverless.yml / CloudFormation
3. Add example for all Amplify "categories"
4. Add Branch integration
5. Document how to add a team member to an existing project
