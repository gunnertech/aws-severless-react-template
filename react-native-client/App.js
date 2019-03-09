import React from 'react';
import { Font, DangerZone } from 'expo';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import Sentry from 'sentry-expo';
import { withClientState } from 'apollo-link-state';
import { ThemeProvider } from 'react-native-elements';
import { Cache } from 'aws-amplify';

import AppNavigator from './src/Navigators/App'
import muiTheme from './src/Styles/muiTheme'
import getElementsTheme from './src/Styles/elementsTheme'
import ENV from './src/environment'

import { CurrentUserProvider } from './src/Contexts/CurrentUser'



import GetUser from "./src/api/Queries/GetUser"
import CreateUser from "./src/api/Mutations/CreateUser"
import UpdateUser from "./src/api/Mutations/UpdateUser"
import CreateAssignedRole from "./src/api/Mutations/CreateAssignedRole"
import CreateRole from "./src/api/Mutations/CreateRole"
import QueryRolesByNameIdIndex from './src/api/Queries/QueryRolesByNameIdIndex'
import ListInvitations from './src/api/Queries/ListInvitations'
import UpdateInvitation from "./src/api/Mutations/UpdateInvitation"

// import normalizePhoneNumber from './src/Util/normalizePhoneNumber'

import { I18n } from 'aws-amplify';

const authScreenLabels = {
    en: {
        "Username": "Email",
        "Enter your username": "Enter your email",
        'Sign Up': 'Create new account',
        'Sign Up Account': 'Create a new account',
        'Confirm Sign Up': 'Confirm Sign Up by entering the code that was sent to your email address'
    }
};

DangerZone.Branch.subscribe(bundle =>
  bundle && bundle.params && !bundle.error && bundle.params.user (
    Cache.setItem('inviteInputs', bundle.params.user)
  )
)

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);




// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true;

Sentry.config(ENV.sentry_url).install();


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
    AWSS3: {
      bucket: ENV.bucket,
      region: ENV.awsRegion
    }
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
      .then(invitations => invitations.filter(invitation => !invitation.accepted).find(
        invitation => 
          (!!invitation.email && !!user.email && (invitation.email||"").toLowerCase() === (user.email||"").toLowerCase())
      ))

  
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
    client.mutate({
      mutation: UpdateInvitation,
      onError: e => console.log("_acceptInvitationForUser", e),
      variables: {
        id: invitation.id,
        accepted: true
      },
    })
      .then(({data: {updateInvitation}}) => this._addRoleToUser(invitation.roleName, user))

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
        phone: cognitoUser.attributes.phone_number || undefined,
        email: cognitoUser.attributes.email || undefined,
        name: cognitoUser.attributes.name || undefined,
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
            null
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
      .then(currentUser => 
        !currentUser.active ? (
          new Promise(resolve => this.setState({currentUser: null}, resolve.bind(null, null)))
        ) : (
          new Promise(resolve => this.setState({currentUser}, resolve.bind(null, currentUser)))
        )
      )
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
                <ThemeProvider theme={getElementsTheme(getTheme(muiTheme))}>
                  <ThemeContext.Provider value={getTheme(muiTheme)}>
                    {
                      typeof(this.state.currentUser) === 'undefined' ? (
                        null
                      ) : (
                        <AppNavigator />
                      )
                    }
                  </ThemeContext.Provider>
                </ThemeProvider>
              </CurrentUserProvider>
            </Rehydrated>
          </ApolloProvider>
      )
    );
  }
}

export default App