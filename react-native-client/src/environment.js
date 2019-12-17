import Constants from 'expo-constants';

// sentry_url will be the same for every env. 
// You have to add the project to the gunner tech account to get the sentry_url 
// (https://sentry.io/organizations/gunner-technology/projects/new/)
const sentry_url = '<sentry-url>'

const ENV = {
  
cody: {
    cdn: 'd39auyp1deqjks.cloudfront.net',
    base_url: "https://cody.demxohd6gpgdd.amplifyapp.com",
    sentry_url: '<sentry-url>',
  },
  
staging: {
    cdn: 'dr7rwb9vnk0kt.cloudfront.net',
    base_url: "https://staging.d39zc1b92k60o6.amplifyapp.com",
    sentry_url: '<sentry-url>',
  },
  
dary: {
    cdn: 'd318wd2uqf9jsy.cloudfront.net',
    base_url: "https://dary.d35g4cufl7b8q9.amplifyapp.com",
    sentry_url: '<sentry-url>',
  },
  //<new-environment>



}

function getEnvVars(env = '') {
  return ENV[env];
}


export default getEnvVars(Constants.manifest.releaseChannel || Constants.manifest.extra.ENV)