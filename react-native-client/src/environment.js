import { Constants } from 'expo'

// sentry_url will be the same for every env. 
// You have to add the project to the gunner tech account to get the sentry_url 
// (https://sentry.io/organizations/gunner-technology/projects/new/)
const sentry_url = '<sentry-url>'

const ENV = {
  dev: {
    cdn: '<dev-cloudfront-domain>',
    base_url: "https://dev.<dev-app-id>.amplifyapp.com",
    sentry_url
  },
  staging: {
    cdn: '<staging-cloudfront-domain>',
    base_url: "https://staging.<staging-app-id>.amplifyapp.com",
    sentry_url
  },
  prod: {
    cdn: '<prod-cloudfront-domain>',
    base_url: "https://prod.<prod-app-id>.amplifyapp.com",
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