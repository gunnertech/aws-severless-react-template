import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import * as Sentry from '@sentry/browser';
import { withAuthenticator } from 'aws-amplify-react';


import HomeScreen from "./Screens/Home";
import SplashScreen from "./Screens/Splash";
import SignOutScreen from "./Screens/SignOut";
import UserListScreen from "./Screens/UserList";
import CampaignListScreen from "./Screens/CampaignList";

import CurrentUserContext from './Contexts/CurrentUser';
import { ActionMenuProvider } from './Contexts/ActionMenu';


// import logo from './logo.svg';
// import './App.css';

import Layout from './Components/Layout'

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
    currentUser: null
  }

  onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signOut':
        this.setState({currentUser: null})
        break;
      case 'signIn':
        Auth.currentAuthenticatedUser()
          .then(currentUser => this.setState({currentUser}))
          .catch(err => this.setState({currentUser: null}));
        break;
      default:
        break;
    }
}

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(currentUser => this.setState({currentUser}))
      .catch(err => this.setState({currentUser: null}));
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <CurrentUserContext.Provider value={{currentUser: this.state.currentUser}}>
            <ActionMenuProvider>
              <Router>
                <Layout>
                  <PrivateRoute path='/users' exact component={UserListScreen} />
                  <PrivateRoute path='/campaigns' exact component={CampaignListScreen} />
                  <Route path='/splash' exact component={SplashScreen} />
                  <Route path='/sign-out' exact component={SignOutScreen} />
                  <PrivateRoute path='/' exact component={HomeScreen} />
                </Layout>
              </Router>
            </ActionMenuProvider>
          </CurrentUserContext.Provider>
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

export default App;