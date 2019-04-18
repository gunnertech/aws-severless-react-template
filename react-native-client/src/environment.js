import { Constants } from 'expo'

// sentry_url will be the same for every env. 
// You have to add the project to the gunner tech account to get the sentry_url 
// (https://sentry.io/organizations/gunner-technology/projects/new/)
const sentry_url = 'https://b9af8b89206f42c48c69bc4274a427ac@sentry.io/1323219'

const ENV = {
  dev: {
    cdn: 'de04g0zzfvswt.cloudfront.net', // get this in .build/stack.yml 'CdnDomainName' following your first sls deploy -s dev
    base_url: "https://dev.<amplify-app-id>.amplifyapp.com", //TODO: How to get the app id?
    sentry_url
  },
  staging: {
    cdn: 'd1446fel4axapv.cloudfront.net', // get this in .build/stack.yml 'CdnDomainName' following your first sls deploy -s staging
    base_url: "https://staging.<amplify-app-id>.amplifyapp.com", //TODO: How to get the app id?
    sentry_url
  },
  prod: {
    cdn: 'd1b7rae1naarue.cloudfront.net', // get this in .build/stack.yml 'CdnDomainName' following your first sls deploy -s prod
    base_url: "https://prod.<amplify-app-id>.amplifyapp.com", //TODO: How to get the app id?
    sentry_url
  }
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENV.dev;
  if (env.indexOf('dev') !== -1) return ENV.dev;
  if (env.indexOf('staging') !== -1) return ENV.staging;
  if (env.indexOf('prod') !== -1) return ENV.prod;

  return ENV.dev;
}


export default getEnvVars(Constants.manifest.releaseChannel)