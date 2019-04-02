import { Constants } from 'expo'


// $ aws appsync list-graphql-apis --profile <project-name>-<stage>developer # aws_appsync_graphqlEndpoint
// $ aws pinpoint get-apps --profile <project-name>-<stage>developer # pinpoint_app_id
// $ aws cognito-idp list-user-pools --max-results 2 --profile <project-name>-<stage>developer # userPoolId
// $ aws cognito-idp list-user-pool-clients --max-results 2 --user-pool-id <userPoolId> --profile <project-name>-productiondeveloper # userPoolWebClientId
// $ aws cognito-identity list-identity-pools --max-results 2 --profile <project-name>-<stage>developer # identityPoolId
// $ aws cloudfront list-distributions --profile <project-name>-<stage>developer # cdn
// sentry_url will be the same for every env. You have to add the project to the gunner tech account to get the sentry_url (https://sentry.io/organizations/gunner-technology/projects/new/)

const sentry_url = 'https://b9af8b89206f42c48c69bc4274a427ac@sentry.io/1323219'

const ENV = {
  development: {
    userPoolId: 'us-east-1_0sE0RvlUs',
    identityPoolId: 'us-east-1:16150fd6-edc9-4cc2-a2e1-0f0edc1b1168',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '1pjn5c59qk60op9vn1rq88ln6v',
    aws_appsync_graphqlEndpoint: 'https://3hx7skn62nanfnbuplwi2t5lle.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-<project-name>-development',
    pinpoint_app_id: "67be524b1e9f4f9cb49a11e40e370a01",
    cdn: 'dtfsbcv3jr02i.cloudfront.net',
    base_url: "http://localhost:3000",
    sentry_url
  },
  staging: {
    userPoolId: 'us-east-1_frzrddXO2',
    identityPoolId: 'us-east-1:6168941b-1c37-4980-8de2-6ed799625309',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '6mqltu1tln70f7fok4cfqogo0k',
    aws_appsync_graphqlEndpoint: 'https://l2egmjy6dfgwhpzkxkpp27urpq.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-<project-name>-staging',
    pinpoint_app_id: "5a1bcb16c71d4cfab5e8f7f965540c75",
    cdn: 'd1446fel4axapv.cloudfront.net',
    base_url: "https://staging.d2x31qlfq03ed5.amplifyapp.com",
    sentry_url
  },
  production: {
    userPoolId: 'us-east-1_Z0JoU0XJg',
    identityPoolId: 'us-east-1:98ee0dc7-f50d-4141-8f8b-317bed59e312',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '30iup8r221sdrtdl91qfnsk1c7',
    aws_appsync_graphqlEndpoint: 'https://w24smvyzlrdlzlufvhuiiiwzoa.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-<project-name>-production',
    pinpoint_app_id: "7ea0461c1c444f439bb56775c8ab099b",
    cdn: 'd1b7rae1naarue.cloudfront.net',
    base_url: "https://<project-name>.com",
    sentry_url
  }
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENV.<stage>
  if (env.indexOf('<stage>') !== -1) return ENV.<stage>
  if (env.indexOf('staging') !== -1) return ENV.staging
  if (env.indexOf('production') !== -1) return ENV.production

  return ENV.<stage>
}


export default getEnvVars(Constants.manifest.releaseChannel)