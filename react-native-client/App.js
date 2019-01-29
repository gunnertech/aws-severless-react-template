import React from 'react';
import { Font } from 'expo';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import Amplify, { Auth, Hub } from 'aws-amplify';
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


import GetUser from "./src/api/Queries/GetUser"
import CreateUser from "./src/api/Mutations/CreateUser"
import UpdateUser from "./src/api/Mutations/UpdateUser"
import CreateOrganization from "./src/api/Mutations/CreateOrganization"
import CreateAssignedRole from "./src/api/Mutations/CreateAssignedRole"
import CreateRole from "./src/api/Mutations/CreateRole"
import QueryRolesByNameIdIndex from './src/api/Queries/QueryRolesByNameIdIndex'
import ListInvitations from './src/api/Queries/ListInvitations'

import normalizePhoneNumber from './src/Util/normalizePhoneNumber'



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
const client = new AWSAppSyncClient({disableOffline: true}, { link });

class App extends React.Component {
  constructor(props) {
    super(props);
    Hub.listen('auth', this, 'AppListener');
  }

  state = {
    fontLoaded: false,
    currentUser: undefined
  };

  _findInvitation = user =>
    client.query({
      query: ListInvitations,
      variables: {first: 10000},
      fetchPolicy: "network-only"
    })
      .then(({data: {listInvitations: {items}}}) => items)
      .then(invitations => invitations.find(
        invitation => 
          (!!invitation.email && (invitation.email||"").toLowerCase() === (user.email||"").toLowerCase()) || 
          (!!invitation.phone && normalizePhoneNumber(invitation.phone||"") === normalizePhoneNumber(user.phone||"")))
      )

  _createOrganization = user =>
    client.mutate({
      mutation: CreateOrganization,
      onError: e => console.log("_createOrganization", e),
      variables: {
        name: `${user.id}'s Org`,
        ownerId: user.id
      },
    })

  _addUserToOrganization = (user, organizationId) =>
    client.mutate({
      mutation: UpdateUser,
      onError: e => console.log("_addUserToOrganization", e),
      variables: {
        id: user.id,
        organizationId: organizationId
      },
    })
      .then(({data: {updateUser}}) => Promise.resolve(updateUser))

  _acceptInvitationForUser = (invitation, user) =>
    this._addRoleToUser(invitation.roleName, user)

  _addRoleToUser = (roleName, user) =>
    client.query({
      query: QueryRolesByNameIdIndex,
      variables: {name: roleName},
      fetchPolicy: "network-only"
    })
    .then(({data: { queryRolesByNameIdIndex }}) =>
      (
        !queryRolesByNameIdIndex || !queryRolesByNameIdIndex.items.length ? (
          client.mutate({
            mutation: CreateRole,
            onError: e => console.log("CreateRole", e),
            variables: {
              name: roleName,
            },
          })
          .then(({data: {createRole}}) => Promise.resolve(createRole))
        ) : (
          Promise.resolve(queryRolesByNameIdIndex.items[0])
        )
      )
      .then(role =>
        client.mutate({
          mutation: CreateAssignedRole,
          onError: e => console.log("CreateAssignedRole", e),
          variables: {
            roleId: role.id,
            userId: user.id
          },
        })
        .then(() => Promise.resolve(user))
      )
    )

  _createNewUser = cognitoUser =>
    client.mutate({
      mutation: CreateUser,
      onError: e => console.log("_createNewUser", e),
      variables: {
        id: cognitoUser.username,
        phone: cognitoUser.attributes.phone_number || "",
        email: cognitoUser.attributes.email || "",
        active: true,
      },
    })
    .then(({data: {createUser}}) => Promise.resolve(createUser))

  _handleSignIn = () =>
    new Promise(resolve => this.setState({currentUser: undefined}, resolve))
      .then(() =>
        Auth.currentAuthenticatedUser()
      )
      .then(cognitoUser => Promise.all([
        client.query({
          query: GetUser,
          variables: {id: cognitoUser.username},
          fetchPolicy: "network-only"
        }),
        cognitoUser
      ]))
      .then(([{data: { getUser }, loading}, cognitoUser]) => !!getUser ? (
          Promise.resolve(getUser)
        ) : (
          this._createNewUser(cognitoUser)
        )
      )
      .then(user => Promise.all([
        user, this._findInvitation(user)
      ]))
      .then(([user, invitation]) => ([user, invitation]))
      .then(([user, invitation]) => // && !user.organization
        !!invitation ? (
          this._addUserToOrganization(user, invitation.organizationId)
            .then(user => !user.assignedRoles.items.length ? (
                this._acceptInvitationForUser(invitation, user)
              ) : (
                Promise.resolve(user)  
              )
            )
        ) : (
          user.organization ? (
            Promise.resolve(user)
          ) : (
            this._createOrganization(user)
              .then(({data: { createOrganization }}) => this._addUserToOrganization(user, createOrganization.id))
          )
        )
        .then(user =>
          !user.assignedRoles.items.length ? (
            this._addRoleToUser("admin", user)
          ) : (
            Promise.resolve(user)
          )
        )
      )
      .then(currentUser => new Promise(resolve => this.setState({currentUser}, resolve.bind(null, currentUser))))
      .catch(err => console.log("ERROR", err) || this.setState({currentUser: null}));

  
  onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signOut':
        this.setState({currentUser: null})
        break;
      case 'signIn':
        this._handleSignIn()
        break;
      default:
        break;
    }
  }
  
  componentDidMount() {
    Promise.all([
      Font.loadAsync({
        'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
      })
        .then(() => this.setState({ fontLoaded: true }))
      ,
      this._handleSignIn()
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