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

import Home from "./Screens/Home";
import Splash from "./Screens/Splash";
import SignOut from "./Screens/SignOut";

import { LayoutProvider } from './Contexts/Layout'
import { CurrentUserProvider } from './Contexts/CurrentUser'
import { ActionMenuProvider } from './Contexts/ActionMenu';
import { NotificationsProvider } from './Contexts/Notifications'

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
  dsn: "https://34bea9df112c4d00bcbfeff777c134f5@sentry.io/1363109" //TODO: SETUP AND CHANGE THIS
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

  _handleSignIn = () =>
    new Promise(resolve => this.setState({currentUser: undefined}, resolve))
      .then(() =>
        Auth.currentAuthenticatedUser()
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
    this._handleSignIn();
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <ActionMenuProvider>
            <NotificationsProvider notifications={this.state.notifications}>
              <CurrentUserProvider currentUser={this.state.currentUser}>
                {
                  typeof(this.state.currentUser) === 'undefined' ? (
                    null
                  ) : (
                    <Router>
                      <LayoutProvider showNav={true}>
                        <Switch>
                          <Route path='/' exact component={Splash} />
                          <Route path='/sign-out' exact component={SignOut} />
                          <PrivateRoute path='/home' exact component={Home} />
                        </Switch>
                      </LayoutProvider>
                    </Router>
                  )
                }
              </CurrentUserProvider>
            </NotificationsProvider>
          </ActionMenuProvider>
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

export default App;
