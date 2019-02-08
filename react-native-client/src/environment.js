import { Constants } from 'expo'

//REACT NATIVE TODO: (AFTER BACKEND DEPLOY): SET ALL THESE VARIABLES AFTER YOU DEPLOY BACKEND FOR THE FIRST TIME
// $ aws appsync list-graphql-apis --profile <profile> # aws_appsync_graphqlEndpoint
// $ aws pinpoint get-apps --profile <profile> # pinpoint_app_id
// $ aws cognito-idp list-user-pools --max-results 2 --profile <profile> # userPoolId
// $ aws cognito-idp list-user-pool-clients --max-results 2 --user-pool-id <ID> --profile <profile> # userPoolWebClientId
// $ aws cognito-identity list-identity-pools --max-results 2 --profile <profile> # identityPoolId
// $ aws cloudfront list-distributions --profile <profile> # cdn
// sentry_url will be the same for every env. You have to add the project to the gunner tech account to get the sentry_url (https://sentry.io/organizations/gunner-technology/projects/new/)

const sentry_url = 'https://9d5eb4ad17f847bfb974e22a1b797b6e@sentry.io/1385931'

const ENV = {
  development: {
    userPoolId: 'us-east-1_4hXYouKxr',
    identityPoolId: 'us-east-1:dbfff321-0bfa-4b47-bb40-0469cb0532b6',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '28a8ah5645hnqgf81pbh2gkdfb',
    aws_appsync_graphqlEndpoint: 'https://f5mmxafkdngq7k3sfel4bnc6de.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-<project name>-development',
    pinpoint_app_id: "ec37e44c842e4c0a93ce705d441053b2",
    cdn: 'd3bu4gv79xjhue.cloudfront.net',
    base_url:"https://simplisurvey.com",
    sentry_url
  },
  staging: {
    userPoolId: 'us-east-1_4hXYouKxr',
    identityPoolId: 'us-east-1:dbfff321-0bfa-4b47-bb40-0469cb0532b6',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '28a8ah5645hnqgf81pbh2gkdfb',
    aws_appsync_graphqlEndpoint: 'https://f5mmxafkdngq7k3sfel4bnc6de.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-<project name>-development',
    pinpoint_app_id: "ec37e44c842e4c0a93ce705d441053b2",
    cdn: 'd3bu4gv79xjhue.cloudfront.net',
    base_url:"https://simplisurvey.com",
    sentry_url
  },
  prodution: {
    userPoolId: 'us-east-1_4hXYouKxr',
    identityPoolId: 'us-east-1:dbfff321-0bfa-4b47-bb40-0469cb0532b6',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '28a8ah5645hnqgf81pbh2gkdfb',
    aws_appsync_graphqlEndpoint: 'https://f5mmxafkdngq7k3sfel4bnc6de.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-<project name>-development',
    pinpoint_app_id: "ec37e44c842e4c0a93ce705d441053b2",
    cdn: 'd3bu4gv79xjhue.cloudfront.net',
    base_url:"https://simplisurvey.com",
    sentry_url
  }
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENV.development
  if (env.indexOf('development') !== -1) return ENV.development
  if (env.indexOf('staging') !== -1) return ENV.staging
  if (env.indexOf('production') !== -1) return ENV.production

  return ENV.development
}


export default getEnvVars(Constants.manifest.releaseChannel)