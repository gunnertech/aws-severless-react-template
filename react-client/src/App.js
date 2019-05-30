import React, { Component } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as Sentry from '@sentry/browser';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import gql from 'graphql-tag';

import Router from "./Components/Router"

import { CurrentUserProvider } from './Contexts/CurrentUser'
import { NotificationsProvider } from './Contexts/Notifications'
import { ActionMenuProvider } from './Contexts/ActionMenu';

import { getUser } from './graphql/queries'
import { createUser, updateUser } from './graphql/mutations'



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


class App extends Component {
  constructor(props) {
    super(props);
    Hub.listen('auth', data => 
      console.log('A new auth event has happened: ', data) ||
      this.onAuthEvent(data)             
    )
  }

  state = {
    currentUser: undefined,
    showNav: true,
    notifications: []
  }

  _updateUser = (cognitoUser, groupName) =>
    client.mutate({
      mutation: gql(updateUser),
      onError: e => console.log("_updateUser", e),
      variables: {input:{
        id: cognitoUser.username,
        groups: [groupName]
      }},
    })
    .then(({data: {updateUser}}) => updateUser)

  _createNewUser = (cognitoUser, groupName) =>
    client.mutate({
      mutation: gql(createUser),
      onError: e => console.log("_createNewUser", e),
      variables: {input:{
        id: cognitoUser.username,
        email: cognitoUser.attributes.email || undefined,
        groups: [groupName],
        applicationStatus: groupName === 'Admins' ? 'APPROVED' : 'PENDING'
      }},
    })
    .then(({data: {createUser}}) => createUser)

  _cognitoClient = () =>
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

  _describeUserPool = userPoolId =>
    this._cognitoClient()
      .then(client =>
        client.describeUserPool({
          UserPoolId: userPoolId
        })
        .promise()  
      )

  _addToGroup = (user, groupName) =>
    this._cognitoClient()
      .then(client =>
        client.adminAddUserToGroup({
          GroupName: groupName,
          UserPoolId: user.pool.userPoolId,
          Username: user.username
        })
        .promise()
        .then(console.log) 
      )

  _handleSignIn = () =>
    new Promise(resolve => this.setState({currentUser: undefined}, () => resolve(Auth.currentAuthenticatedUser())))
      .then(cognitoUser => Promise.all([
        cognitoUser,
        //if the user isn't in a group, add them to one
        !(cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || []).length ? ( 
          this._describeUserPool(cognitoUser.pool.userPoolId)
            .then(({UserPool: {EstimatedNumberOfUsers}}) => EstimatedNumberOfUsers <= 2 ? 'Admins' : 'Users')
            .then(groupName => this._addToGroup(cognitoUser, groupName).then(() => groupName))
        ) : (
          cognitoUser.signInUserSession.accessToken.payload['cognito:groups'][0]
        )
      ]))
      .then(([cognitoUser, groupName]) => Promise.all([
        client.query({
          query: gql(getUser),
          variables: {id: cognitoUser.username},
          fetchPolicy: "network-only"
        }),
        cognitoUser,
        groupName
      ]))
      .then(([{data: { getUser }}, cognitoUser, groupName]) => 
        !getUser ? (
          this._createNewUser(cognitoUser, groupName)
        ) : !!(getUser.groups||[]).length ? (
          getUser
        ) : (
          this._updateUser(cognitoUser, groupName)
        )
      )
      .then(currentUser => new Promise(resolve => this.setState({currentUser}, resolve.bind(null, currentUser))))
      .catch(err => console.log(err) || this.setState({currentUser: null}))

  onAuthEvent = capsule => {
    switch (capsule.payload.event) {
      case 'signOut':
        this.setState({currentUser: null});
        break;
      case 'signIn_failure':
      case 'signUp_failure':
        this.setState(
          {notifications: [capsule.payload.data]}, 
          () => setTimeout(() => this.setState({notifications: []}), 4000)
        )
        break;
      case 'signIn':
        setTimeout(this._handleSignIn.bind(this), 200);
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this._handleSignIn();
  }

  render() {
    const { currentUser, notifications } = this.state;
    return (
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    );
  }
}

export default App;