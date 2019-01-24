import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as Sentry from '@sentry/browser';
import { withAuthenticator } from 'aws-amplify-react';


import GetUser from "./api/Queries/GetUser"
import CreateUser from "./api/Mutations/CreateUser"
import UpdateUser from "./api/Mutations/UpdateUser"
import CreateOrganization from "./api/Mutations/CreateOrganization"
import CreateAssignedRole from "./api/Mutations/CreateAssignedRole"
import CreateRole from "./api/Mutations/CreateRole"
import QueryRolesByNameIdIndex from './api/Queries/QueryRolesByNameIdIndex'
import ListInvitations from './api/Queries/ListInvitations'


import HomeScreen from "./Screens/Home";
import SplashScreen from "./Screens/Splash";
import PrivacyPolicyScreen from "./Screens/PrivacyPolicy";
import SignOutScreen from "./Screens/SignOut";
import UserListScreen from "./Screens/UserList";
import CampaignListScreen from "./Screens/CampaignList";
import OrganizationEditScreen from "./Screens/OrganizationEdit";
import SurveyNewScreen from "./Screens/SurveyNew";

import { CurrentUserProvider } from './Contexts/CurrentUser'
import { NotificationsProvider } from './Contexts/Notifications'
import { ActionMenuProvider } from './Contexts/ActionMenu';


import { LayoutProvider } from './Contexts/Layout'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    const ComponentWithAuth = withAuthenticator(Component, false, [], null, null, {
      signUpFields: [
        {
          label: 'Username',
          key: 'username',
          required: true,
          placeholder: 'Username',
          displayOrder: 1,
        },
        {
            label: 'Password',
            key: 'password',
            required: true,
            placeholder: 'Password',
            type: 'password',
            displayOrder: 2,
        },
        {
            label: 'Email',
            key: 'email',
            required: true,
            placeholder: 'Email',
            type: 'email',
            displayOrder: 3
        },
        {
            label: 'Phone Number',
            key: 'phone_number',
            placeholder: 'Phone Number',
            required: false,
            displayOrder: 4
        }
      ]
    });
    return (
      <ComponentWithAuth {...props} />
    )
  }} />
)

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
  url: process.env.REACT_APP_aws_appsync_graphqlEndpoint,
  region: process.env.REACT_APP_awsRegion,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => {
      try {
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();
      } catch(e) {
        await Auth.signIn('simplisurveyguest', 'Sim2010!!'); //TODO: For new environments, you'll have to create this account
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();

      }
    },
  },
});

const link = ApolloLink.from([stateLink, appSyncLink]);
const client = new AWSAppSyncClient({disableOffline: true}, { link });

Sentry.init({
  dsn: "https://b9af8b89206f42c48c69bc4274a427ac@sentry.io/1323219" //TODO: SETUP AND CHANGE THIS
});

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: process.env.REACT_APP_identityPoolId, 
    // REQUIRED - Amazon Cognito Region
    region: process.env.REACT_APP_awsRegion, 
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_userPoolId,
    identityPoolRegion: 'us-east-1',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: process.env.REACT_APP_userPoolWebClientId, 
  },
  Storage: {
    bucket: process.env.REACT_APP_bucket,
    region: process.env.REACT_APP_awsRegion
  },
  Analytics: {
    disabled: false,
    autoSessionRecord: true,

    AWSPinpoint: {
      appId: process.env.REACT_APP_pinpoint_app_id,
      region: process.env.REACT_APP_awsRegion,
      bufferSize: 1000,
      flushInterval: 5000,
      flushSize: 100,
      resendLimit: 5
    }
  }
});



class App extends Component {
  constructor(props) {
    super(props);
    Hub.listen('auth', this, 'AppListener');
  }

  state = {
    currentUser: undefined,
    showNav: true,
    notifications: []
  }

  _findInvitation = user =>
    client.query({
      query: ListInvitations,
      variables: {first: 10000},
      fetchPolicy: "network-only"
    })
      .then(({data: {listInvitations: {items}}}) => items)
      .then(invitations => console.log("invitations", invitations) || invitations.find(invitation => (!!invitation.email && (invitation.email||"").toLowerCase() === (user.email||"").toLowerCase()) || (!!invitation.phone && invitation.phone === user.phone)))

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
      .then(() => Promise.resolve(null))

  _addRoleToUser = (roleName, user) => console.log("ROLENAME", roleName) ||
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

  _refreshCurrentUser = () =>
    client.query({
      query: GetUser,
      variables: {id: this.state.currentUser.id},
      fetchPolicy: "network-only"
    })
    .then(({data}) => 
      new Promise(resolve => this.setState({currentUser: data.getUser}, resolve))
    )


  _createNewUser = cognitoUser =>
    client.mutate({
      mutation: CreateUser,
      onError: e => console.log("_createNewUser", e),
      variables: {
        id: cognitoUser.username,
        phone: cognitoUser.attributes.phone_number || undefined,
        email: cognitoUser.attributes.email || undefined,
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
      .then(([user, invitation]) =>
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
      case 'signIn_failure':
      case 'signUp_failure':
        this.setState({notifications: [capsule.payload.data]})
        break;
      case 'signIn':
        this._handleSignIn()
        break;
      default:
        break;
    }
}

  componentDidMount() {
    this._handleSignIn();
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <NotificationsProvider notifications={this.state.notifications}>
            <CurrentUserProvider currentUser={this.state.currentUser} refreshCurrentUser={this._refreshCurrentUser.bind(this)}>
              {
                typeof(this.state.currentUser) === 'undefined' ? (
                  null
                ) : (
                  <ActionMenuProvider>
                    <Router>
                      <LayoutProvider showNav={true}>
                        <Switch>
                          <PrivateRoute path='/users' exact component={UserListScreen} />
                          <PrivateRoute path='/campaigns' exact component={CampaignListScreen} />
                          <PrivateRoute path='/settings' exact component={OrganizationEditScreen} />
                          <Route path='/' exact component={SplashScreen} />
                          <Route path='/sign-out' exact component={SignOutScreen} />
                          <Route path='/surveys/:surveyId' exact component={SurveyNewScreen} />
                          <Route path='/privacy-policy' exact component={PrivacyPolicyScreen} />
                          <PrivateRoute path='/dashboard' exact component={HomeScreen} />
                        </Switch>
                      </LayoutProvider>
                    </Router>
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