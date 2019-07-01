import React, { useState, useEffect } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as Sentry from '@sentry/browser';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

import getCurrentUserFromCognitoUser from './Util/getCurrentUserFromCognitoUser'

import Router from "./Components/Router"

import { CurrentUserProvider } from './Contexts/CurrentUser'
import { NotificationsProvider } from './Contexts/Notifications'
import { ActionMenuProvider } from './Contexts/ActionMenu';



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

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

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
        return session.getIdToken().getJwtToken();
      } catch(e) {
        if(!!process.env.REACT_APP_guest_user_name && !!process.env.REACT_APP_guest_password) {
          await Auth.signIn(process.env.REACT_APP_guest_user_name, process.env.REACT_APP_guest_password);
          const session = await Auth.currentSession();
          return session.getIdToken().getJwtToken();
        }
        return null;

      }
    },
  },
});

const link = ApolloLink.from([stateLink, appSyncLink]);
const client = new AWSAppSyncClient({disableOffline: true}, { link });

if(!!process.env.REACT_APP_sentry_url && !!process.env.REACT_APP_sentry_url.replace("<sentry-url>","")) {
  Sentry.enableInExpoDevelopment = false;
  Sentry.init({
    dsn: process.env.REACT_APP_sentry_url
  });
}

Amplify.configure(awsmobile);

const cognitoClient = () =>
  Auth.currentCredentials()
    .then(credentials =>
      Promise.resolve(
        new CognitoIdentityServiceProvider({
          apiVersion: '2016-04-18',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
      )
    )

const describeUserPool = userPoolId =>
  cognitoClient()
    .then(client =>
      client.describeUserPool({
        UserPoolId: userPoolId
      })
      .promise()  
    )

const addToGroup = (user, groupName) =>
  cognitoClient()
    .then(client =>
      client.adminAddUserToGroup({
        GroupName: groupName,
        UserPoolId: user.pool.userPoolId,
        Username: user.username
      })
      .promise()
    )

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [cognitoUser, setCognitoUser] = useState(undefined);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(cognitoUser => setCognitoUser(cognitoUser))
      .catch(err => setCognitoUser(null))
  }, [1]);

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
  }, [1]);

  useEffect(() => {
    
    !cognitoUser ? (
      setCurrentUser(cognitoUser)
    ) : cognitoUser.username === process.env.REACT_APP_guest_user_name || cognitoUser.attributes.email === process.env.REACT_APP_guest_user_name ? (
      setCurrentUser(null)
    ) : (
      getCurrentUserFromCognitoUser(client, cognitoUser)
        .then(currentUser => setCurrentUser({...currentUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])}))
        .catch(err => [
          console.log(err),
          setCurrentUser(null),
          setCognitoUser(null)
        ])
    )

  }, [cognitoUser])

  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Rehydrated>
          <NotificationsProvider notifications={notifications}>
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
          </NotificationsProvider>
        </Rehydrated>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}


export default App;