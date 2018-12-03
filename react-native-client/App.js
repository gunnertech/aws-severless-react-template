import React from 'react';
import { Font } from 'expo';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import Amplify, { Auth } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import Sentry from 'sentry-expo';
import { withClientState } from 'apollo-link-state';

import AppNavigator from './src/Navigators/App'
import muiTheme from './src/Styles/muiTheme'
import ENV from './src/environment'

import { CurrentUserProvider } from './src/Contexts/CurrentUser'







// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true;

Sentry.config('https://b9af8b89206f42c48c69bc4274a427ac@sentry.io/1323219').install(); //TODO: Set up project and copy info here


console.disableYellowBox = true;

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: ENV.identityPoolId, 
    // REQUIRED - Amazon Cognito Region
    region: ENV.awsRegion, 
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: ENV.userPoolId,
    identityPoolRegion: 'us-east-1',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: ENV.userPoolWebClientId, 
  },
  Storage: {
    bucket: ENV.bucket,
    region: ENV.awsRegion
  },
  Analytics: {
    disabled: false,
    autoSessionRecord: true,

    AWSPinpoint: {
      appId: ENV.pinpoint_app_id,
      region: ENV.awsRegion,
      bufferSize: 1000,
      flushInterval: 5000,
      flushSize: 100,
      resendLimit: 5
    }
  }
});


const defaults = {};
const resolvers = {};
const typeDefs = ``;

const stateLink = createLinkWithCache(cache => withClientState({ 
  resolvers, 
  defaults, 
  cache, 
  typeDefs 
}));


const appSyncLink = createAppSyncLink({
  url: ENV.aws_appsync_graphqlEndpoint,
  region: ENV.awsRegion,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => {
      try {
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();
      } catch(e) {
        return null;
      }
    },
  },
});

const link = ApolloLink.from([stateLink, appSyncLink]);
const client = new AWSAppSyncClient({disableOffline: false}, { link });

class App extends React.Component {
  state = {
    fontLoaded: false,
    currentUser: undefined
  };

  componentDidMount() {
    Promise.all([
      Font.loadAsync({
        'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
      })
        .then(() => this.setState({ fontLoaded: true }))
      ,
      Auth.currentAuthenticatedUser()
        .then(currentUser => this.setState({currentUser}))
        .catch(err => this.setState({currentUser: null}))
    ])
  }

  render() {
    return (
      !this.state.fontLoaded ? (
        null
      ) : (
        <ApolloProvider client={client}>
          <Rehydrated>
            <CurrentUserProvider currentUser={this.state.currentUser}>
              <ThemeContext.Provider value={getTheme(muiTheme)}>
                {
                  typeof(this.state.currentUser) === 'undefined' ? (
                    null
                  ) : (
                    <AppNavigator />
                  )
                }
              </ThemeContext.Provider>
            </CurrentUserProvider>
          </Rehydrated>
        </ApolloProvider>
      )
    );
  }
}

export default App