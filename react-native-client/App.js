import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import Branch from 'react-native-branch'
import { ThemeContext, getTheme } from 'react-native-material-ui';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import Sentry from 'sentry-expo';
import { withClientState } from 'apollo-link-state';
import { ThemeProvider } from 'react-native-elements';
import { Cache } from 'aws-amplify';

import CurrentUserUpdater from "./src/Components/CurrentUserUpdater"

import AppNavigator from './src/Navigators/App'

import getCurrentUserFromCognitoUser from './src/Util/getCurrentUserFromCognitoUser';

import muiTheme from './src/Styles/muiTheme'
import getElementsTheme from './src/Styles/elementsTheme'
import ENV from './src/environment'

import { CurrentUserProvider } from './src/Contexts/CurrentUser'

import { I18n } from 'aws-amplify';
import awsmobile from './aws-exports';

const authScreenLabels = {
    en: {
        "Username": "Email",
        "Enter your username": "Enter your email",
        'Sign Up': 'Create new account',
        'Sign Up Account': 'Create a new account',
        'Confirm Sign Up': 'Confirm Sign Up by entering the code that was sent to your email address'
    }
};

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
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => {
      try {
        const session = await Auth.currentSession();
        return await session.getIdToken().getJwtToken();
      } catch(e) {
        if(!!process.env.REACT_APP_guest_user_name && !!process.env.REACT_APP_guest_password) {
          const existingToken = await Cache.getItem('jwtToken');

          if(existingToken) {        
            return existingToken;
          }

          await Auth.signIn(process.env.REACT_APP_guest_user_name, process.env.REACT_APP_guest_password);
          const session = await Auth.currentSession();
          const newToken = await session.getIdToken().getJwtToken();
          await Cache.setItem('jwtToken', newToken, { expires: moment().add(10, 'minutes').toDate().getTime()});
          await Auth.signOut();
          return newToken;
        }

        return null;

      }
    },
  },
});

const link = ApolloLink.from([stateLink, appSyncLink]);
const client = new AWSAppSyncClient({disableOffline: true}, { link });

Branch.subscribe(bundle =>
  bundle && bundle.params && !bundle.error && bundle.params && bundle.params.user && (
    Cache.setItem('inviteInputs', bundle.params.user)
  )
)

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

if(!!ENV.sentry_url && !!ENV.sentry_url.replace("<sentry-url>","")) {
  Sentry.enableInExpoDevelopment = false;
  Sentry.config(ENV.sentry_url).install();
}


console.disableYellowBox = true;

Amplify.configure(awsmobile);



const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [cognitoUser, setCognitoUser] = useState(undefined);
  const [shouldUpdateCurrentUser, setShouldUpdateCurrentUser] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
    })
      .then(() => setFontLoaded(true))
  }, [])

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(cognitoUser => setCognitoUser(cognitoUser))
      .catch(err => setCognitoUser(null))
  }, []);

  useEffect(() => {
    const onAuthEvent = capsule => {
      switch (capsule.payload.event) {
        case 'signOut':
          setCurrentUser(null);
          setCognitoUser(null);
          break;
        case 'signIn_failure':
        case 'signUp_failure':
          setNotifications([capsule.payload.data])
          setTimeout(() => setNotifications([]), 4000)
          break;
        case 'signIn':
            setCognitoUser(capsule.payload.data);
          break;
        default:
          break;
      }
    }

    Hub.listen('auth', onAuthEvent);

    return () =>
      Hub.remove(('auth', onAuthEvent))
  }, []);

  useEffect(() => {
    
    !cognitoUser ? (
      setCurrentUser(cognitoUser)
    ) : cognitoUser.username === process.env.REACT_APP_guest_user_name || cognitoUser.attributes.email === process.env.REACT_APP_guest_user_name ? (
      setCurrentUser(null)
    ) : (
      getCurrentUserFromCognitoUser(client, cognitoUser)
        .then(currentUser => setCurrentUser({...currentUser, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])}))
        .catch(err => [
          console.log(err),
          setCurrentUser(null),
          setCognitoUser(null)
        ])
    )

  }, [cognitoUser, shouldUpdateCurrentUser])

  return (
    !fontLoaded ? null :
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Rehydrated>
          <CurrentUserProvider currentUser={currentUser}>
            <ThemeProvider theme={getElementsTheme(getTheme(muiTheme))}>
              <ThemeContext.Provider value={getTheme(muiTheme)}>
                {
                  !!currentUser && 
                  <CurrentUserUpdater currentUser={currentUser} onUpdate={setShouldUpdateCurrentUser} />
                }
                {
                  typeof(currentUser) === 'undefined' ? (
                    null
                  ) : (
                    <AppNavigator />
                  )
                }
              </ThemeContext.Provider>
            </ThemeProvider>
          </CurrentUserProvider>
        </Rehydrated>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}

export default App