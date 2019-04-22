import { Constants } from 'expo'

// sentry_url will be the same for every env. 
// You have to add the project to the gunner tech account to get the sentry_url 
// (https://sentry.io/organizations/gunner-technology/projects/new/)
const sentry_url = '<sentry-url>'

const ENV = {
  //<new-environment>
}

function getEnvVars(env = '') {
  return ENV[env];
}


export default getEnvVars(Constants.manifest.releaseChannel)