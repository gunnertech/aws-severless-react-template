import { Constants } from 'expo'

const ENV = {
  dev: {
    userPoolId: 'us-east-1_4hXYouKxr',
    identityPoolId: 'us-east-1:dbfff321-0bfa-4b47-bb40-0469cb0532b6',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '28a8ah5645hnqgf81pbh2gkdfb',
    aws_appsync_graphqlEndpoint: 'https://f5mmxafkdngq7k3sfel4bnc6de.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-simplisurvey-dev',
    pinpoint_app_id: "ec37e44c842e4c0a93ce705d441053b2",
    base_url:"https://simplisurvey.com"
  },
  staging: {
    userPoolId: 'us-east-1_4hXYouKxr',
    identityPoolId: 'us-east-1:dbfff321-0bfa-4b47-bb40-0469cb0532b6',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '28a8ah5645hnqgf81pbh2gkdfb',
    aws_appsync_graphqlEndpoint: 'https://f5mmxafkdngq7k3sfel4bnc6de.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-simplisurvey-dev',
    pinpoint_app_id: "ec37e44c842e4c0a93ce705d441053b2"
  },
  prod: {
    userPoolId: 'us-east-1_4hXYouKxr',
    identityPoolId: 'us-east-1:dbfff321-0bfa-4b47-bb40-0469cb0532b6',
    awsRegion: 'us-east-1',
    userPoolWebClientId: '28a8ah5645hnqgf81pbh2gkdfb',
    aws_appsync_graphqlEndpoint: 'https://f5mmxafkdngq7k3sfel4bnc6de.appsync-api.us-east-1.amazonaws.com/graphql',
    bucket: 'com-gunnertech-simplisurvey-dev',
    pinpoint_app_id: "ec37e44c842e4c0a93ce705d441053b2"
  }
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENV.dev
  if (env.indexOf('dev') !== -1) return ENV.dev
  if (env.indexOf('staging') !== -1) return ENV.staging
  if (env.indexOf('prod') !== -1) return ENV.prod

  return ENV.dev
}


export default getEnvVars(Constants.manifest.releaseChannel)