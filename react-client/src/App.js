import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Amplify, { Auth } from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';


import logo from './logo.svg';
// import './App.css';

import Layout from './Components/Layout'

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
  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <Router>
            <Layout>
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    Edit <code>src/App.js</code> and save to reload.
                  </p>
                  <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn React
                  </a>
                </header>
              </div>
            </Layout>
          </Router>
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

export default App;
