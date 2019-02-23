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

import GetUser from "./api/Queries/GetUser"
import CreateUser from "./api/Mutations/CreateUser"
import UpdateUser from "./api/Mutations/UpdateUser"

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
              key: 'email',
              type: 'email',
              required: true,
              label: 'Email',
              displayOrder: 2,
              placeholder: "Enter your email (used to sign in)"
            },
            {
              key: 'name',
              type: 'text',
              required: true,
              label: 'Name',
              displayOrder: 1,
              placeholder: "Enter the name you want others to see"
            },
            {
              key: 'phone_number',
              type: 'tel',
              required: false,
              label: 'Mobile',
              displayOrder: 4,
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
  url: process.env.REACT_APP_aws_appsync_graphqlEndpoint,
  region: process.env.REACT_APP_awsRegion,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => {
      try {
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();
      } catch(e) {
        await Auth.signIn('simplisurveyguest@gunnertech.com', 'Sim2010!!'); //TODO: For new environments, you'll have to create this account
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();

      }
    },
  },
});

const link = ApolloLink.from([stateLink, appSyncLink]);
const client = new AWSAppSyncClient({disableOffline: true}, { link });

Sentry.init({
  dsn: process.env.REACT_APP_sentry_url
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
    AWSS3: {
      bucket: process.env.REACT_APP_bucket,
      region: process.env.REACT_APP_awsRegion
    }
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
      .then(currentUser => new Promise(resolve => this.setState({currentUser}, resolve.bind(null, currentUser))))
      .catch(err => console.log("ERROR", err) || this.setState({currentUser: null}));

  onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signOut':
        this.setState({currentUser: null})
        break;
      case 'signIn_failure':
      case 'signUp_failure':
        this.setState(
          {notifications: [capsule.payload.data]}, 
          () => setTimeout(() => this.setState({notifications: []}), 4000)
        )
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