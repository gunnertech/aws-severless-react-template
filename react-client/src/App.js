import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as Sentry from '@sentry/browser';
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, VerifyContact, withAuthenticator } from 'aws-amplify-react';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

import SignUp from "./Screens/SignUp";
import SignIn from "./Screens/SignIn";
import HomeScreen from "./Screens/Home";
import SplashScreen from "./Screens/Splash";
import PrivacyPolicyScreen from "./Screens/PrivacyPolicy";
import SignOutScreen from "./Screens/SignOut";

import { CurrentUserProvider } from './Contexts/CurrentUser'
import { NotificationsProvider } from './Contexts/Notifications'
import { ActionMenuProvider } from './Contexts/ActionMenu';
import { LayoutProvider } from './Contexts/Layout'


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

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    const ComponentWithAuth = withAuthenticator(Component, false, [
      <SignIn/>,
      <ConfirmSignIn/>,
      <VerifyContact/>,
      <SignUp

        signUpConfig={{
          hideAllDefaults: true,
          signUpFields: [
            {
              key: 'name',
              type: 'text',
              required: true,
              label: 'Name',
              displayOrder: 1,
              placeholder: "Name (as you want others to see it)"
            },
            {
              key: 'username',
              type: 'email',
              required: true,
              label: 'Email',
              displayOrder: 2,
              placeholder: "Enter your email (used to sign in)"
            },
            
            {
              key: 'phone_number',
              type: 'tel',
              required: false,
              label: 'Mobile',
              displayOrder: 3,
              placeholder: "Enter your mobile number"
            },
            {
              key: 'password',
              type: 'password',
              required: true,
              label: 'Password',
              displayOrder: 4,
              placeholder: "Enter your password"
            }
          ]
      }}
    />,
    <ConfirmSignUp/>,
    <ForgotPassword/>,
    <RequireNewPassword />
  ], false);

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
      console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event) ||
      this.onAuthEvent(data)             
    )
  }

  state = {
    currentUser: undefined,
    showNav: true,
    notifications: []
  }

  // _createNewUser = cognitoUser =>
  //   client.mutate({
  //     mutation: CreateUser,
  //     onError: e => console.log("_createNewUser", e),
  //     variables: {
  //       id: cognitoUser.username,
  //       phone: cognitoUser.attributes.phone_number || undefined,
  //       email: cognitoUser.attributes.email || undefined,
  //       name: cognitoUser.attributes.name || undefined,
  //       active: true,
  //     },
  //   })
  //   .then(({data: {createUser}}) => Promise.resolve(createUser))
//console.log(CognitoIdentityServiceProvider)
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
      )

  _handleSignIn = () =>
    new Promise(resolve => this.setState({currentUser: undefined}, () => resolve(Auth.currentAuthenticatedUser())))
      .then(cognitoUser => 
        !!(cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || []).length ? (
          Promise.resolve(cognitoUser)
        ) : (
          this._describeUserPool(cognitoUser.pool.userPoolId)
            .then(result => 
              this._addToGroup(cognitoUser, result.UserPool.EstimatedNumberOfUsers <= 2 ? 'Admins' : 'Users')  
            )
        )
        .then(() => Promise.resolve(cognitoUser))
      )
      // .then(cognitoUser => Promise.all([
      //   client.query({
      //     query: GetUser,
      //     variables: {id: cognitoUser.username},
      //     fetchPolicy: "network-only"
      //   }),
      //   cognitoUser
      // ]))
      // .then(([{data: { getUser }, loading}, cognitoUser]) => !!getUser ? (
      //     Promise.resolve(getUser)
      //   ) : (
      //     this._createNewUser(cognitoUser)
      //   )
      // )
      .then(currentUser => new Promise(resolve => this.setState({currentUser}, resolve.bind(null, currentUser))))
      .then(() => this.forceUpdate())
      .catch(err => this.setState({currentUser: null}));

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
                    <Router>
                      <LayoutProvider showNav={true}>
                        <Switch>
                          <Route path='/' exact component={SplashScreen} />
                          <Route path='/sign-out' exact component={SignOutScreen} />
                          <Route path='/privacy-policy' exact component={PrivacyPolicyScreen} />
                          <PrivateRoute path='/home' exact component={HomeScreen} />
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