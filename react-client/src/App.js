import React, { useState, useEffect } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as Sentry from '@sentry/browser';
import { Cache } from 'aws-amplify';
import moment from 'moment';



import Router from "./Components/Router"


import { CurrentUserProvider } from './Contexts/CurrentUser'
import { ActionMenuProvider } from './Contexts/ActionMenu';



import { I18n } from 'aws-amplify';

import awsmobile from './aws-exports';

import HydrateCognitoUser from "./Components/HydrateCognitoUser"

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

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

if(!!process.env.REACT_APP_sentry_url && !!process.env.REACT_APP_sentry_url.replace("<sentry-url>","")) {
  Sentry.enableInExpoDevelopment = false;
  Sentry.init({
    dsn: process.env.REACT_APP_sentry_url
  });
}

Amplify.configure(awsmobile);




const App = () => {
  const [cognitoUser, setCognitoUser] = useState(undefined);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(cognitoUser => setCognitoUser(cognitoUser))
      .catch(err => setCognitoUser(null))
  }, []);

  useEffect(() => {
    const onAuthEvent = capsule => {
      switch (capsule.payload.event) {
        case 'signOut':
          setCognitoUser(null);
          break;
        case 'signIn_failure':
        case 'signUp_failure':
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


  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Rehydrated>
          <HydrateCognitoUser cognitoUser={cognitoUser}>
            {currentUser =>
              <CurrentUserProvider currentUser={currentUser}>
                {
                  typeof(currentUser) === 'undefined' ? (
                    null
                  ) : (
                    <ActionMenuProvider>
                      <Router />
                    </ActionMenuProvider>
                  )
                }
              </CurrentUserProvider>
            }
          </HydrateCognitoUser>
        </Rehydrated>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}


export default App;