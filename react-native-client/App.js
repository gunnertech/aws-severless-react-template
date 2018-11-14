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
import gql from 'graphql-tag';

//TODO: COPY THESE FROM ANOTHER PROJECT
import AppNavigator from './src/Navigators/App'
import muiTheme from './src/Styles/muiTheme'
import ENV from './src/environment'






// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true;

Sentry.config('https://4dfede1615e74fd7b7ee6217b3d2386c@sentry.io/1321423').install();


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
  };

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('./assets/fonts/Roboto-Regular.ttf'), //TODO: COPY FONTS FOLDER FROM ANOTHER PROJECT
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      !this.state.fontLoaded ? (
        null
      ) : (
        <ApolloProvider client={client}>
          <Rehydrated>
            <ThemeContext.Provider value={getTheme(muiTheme)}>
              <AppNavigator />
            </ThemeContext.Provider>
          </Rehydrated>
        </ApolloProvider>
      )
    );
  }
}

export default App