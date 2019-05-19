import { Constants } from 'expo'

// sentry_url will be the same for every env. 
// You have to add the project to the gunner tech account to get the sentry_url 
// (https://sentry.io/organizations/gunner-technology/projects/new/)
const sentry_url = '<sentry-url>'

const ENV = {
  
dary: {
    cdn: 'd3hjvrp3m1mh6h.cloudfront.net',
    base_url: "https://dary.<dary-app-id>.amplifyapp.com",
    sentry_url: '<sentry-url>',
    guest_user_name: null,
    guest_password: null
  },
  //<new-environment>
}

function getEnvVars(env = '') {
  return ENV[env];
}


export default getEnvVars(Constants.manifest.releaseChannel)