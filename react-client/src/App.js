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

import HomeScreen from "./Screens/Home";
import SplashScreen from "./Screens/Splash";
import SignOutScreen from "./Screens/SignOut";
import UserListScreen from "./Screens/UserList";
import CampaignListScreen from "./Screens/CampaignList";
import OrganizationEditScreen from "./Screens/OrganizationEdit";
import SurveyNewScreen from "./Screens/SurveyNew";

import { CurrentUserProvider } from './Contexts/CurrentUser'
import { ActionMenuProvider } from './Contexts/ActionMenu';


// import logo from './logo.svg';
// import './App.css';

import { LayoutProvider } from './Contexts/Layout'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    const ComponentWithAuth = withAuthenticator(Component, false);
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
        return null;
      }
    },
  },
});

const link = ApolloLink.from([stateLink, appSyncLink]);
const client = new AWSAppSyncClient({disableOffline: false}, { link });

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
    showNav: true
  }

  _findInvitation = user =>
    Promise.resolve(null)

  _createOrganization = user =>
    console.log("_createOrganization", "user", user) ||
    client.mutate({
      mutation: CreateOrganization,
      onError: e => console.log("_createOrganization", e),
      variables: {
        name: `${user.id}'s Org`,
        ownerId: user.id
      },
    })

  _addUserToOrganization = (user, organization) =>
    console.log("_addUserToOrganization", "Organization", organization) ||
    client.mutate({
      mutation: UpdateUser,
      onError: e => console.log("_addUserToOrganization", e),
      variables: {
        id: user.id,
        organizationId: organization.id
      },
    })
      .then(({data: {updateUser}}) => console.log("updateUser", updateUser) || Promise.resolve(updateUser))

  _acceptInvitationForUser = (invitation, user) =>
    this._addRoleToUser(invitation.role, user)
      .then(() => Promise.resolve(null))

  _addRoleToUser = (roleName, user) => console.log("Let's add a role!", roleName) ||
    client.query({
      query: QueryRolesByNameIdIndex,
      variables: {name: roleName},
    })
    .then(({data: { queryRolesByNameIdIndex }}) => console.log("Huh?", queryRolesByNameIdIndex) ||
      (
        !queryRolesByNameIdIndex || !queryRolesByNameIdIndex.items.length ? (
          client.mutate({
            mutation: CreateRole,
            onError: e => console.log("CreateRole", e),
            variables: {
              name: roleName,
            },
          })
          .then(({data: {createRole}}) => console.log("ENTRY", createRole) || Promise.resolve(createRole))
        ) : (
          Promise.resolve(queryRolesByNameIdIndex.items[0])
        )
      )
      .then(role => console.log("ROLE", role) ||
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

  _createNewUser = cognitoUser => console.log("Creating user") ||
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
    .then(({data: {createUser}}) => console.log("got user", createUser) || Promise.resolve(createUser))

  _handleSignIn = () => console.log("Doing signin") ||
    new Promise(resolve => this.setState({currentUser: undefined}, resolve))
      .then(() =>
        Auth.currentAuthenticatedUser()
      )
      .then(cognitoUser => Promise.all([
        client.query({
          query: GetUser,
          variables: {id: cognitoUser.username},
        }),
        cognitoUser
      ]))
      .then(([{data: { getUser }, loading}, cognitoUser]) => (console.log("CALLED!") || !!getUser) ? (
          console.log("We have a user") || Promise.resolve(getUser)
        ) : (
          console.log("We don't have a user") || this._createNewUser(cognitoUser)
        )
      )
      .then(user => console.log("Find invitation for", user) || Promise.all([
        user, this._findInvitation(user)
      ]))
      .then(([user, invitation]) => 
        !!invitation ? (
          this._addUserToOrganization(user, invitation.organization)
            .then(() => this._acceptInvitationForUser(invitation, user))
        ) : (
          user.organization ? (
            console.log("Has an organization") || Promise.resolve(user)
          ) : (
            this._createOrganization(user)
              .then(({data: { createOrganization }}) => this._addUserToOrganization(user, createOrganization))
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
      .then(currentUser => console.log("WE DONE") || new Promise(resolve => this.setState({currentUser}, resolve.bind(null, currentUser))))
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
    this._handleSignIn();
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <CurrentUserProvider currentUser={this.state.currentUser}>
            {
              (console.log("this.state.currentUser", this.state.currentUser) || typeof(this.state.currentUser) === 'undefined') ? (
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
                        <Route path='/survey/:surveyTemplateId' exact component={SurveyNewScreen} />
                        <PrivateRoute path='/dashboard' exact component={HomeScreen} />
                      </Switch>
                    </LayoutProvider>
                  </Router>
                </ActionMenuProvider>
              )
            }
          </CurrentUserProvider>
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

export default App;