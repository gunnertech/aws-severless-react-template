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
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

import AppNavigator from './src/Navigators/App'
import muiTheme from './src/Styles/muiTheme'
import getElementsTheme from './src/Styles/elementsTheme'
import ENV from './src/environment'

import { CurrentUserProvider } from './src/Contexts/CurrentUser'

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

DangerZone.Branch.subscribe(bundle =>
  bundle && bundle.params && !bundle.error && bundle.params && bundle.params.user && (
    Cache.setItem('inviteInputs', bundle.params.user)
  )
)

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

if(!!ENV.sentry_url && !!ENV.sentry_url.replace("<sentry-url>","")) {
  Sentry.enableInExpoDevelopment = false;
  Sentry.config(ENV.sentry_url).install();
}


console.disableYellowBox = true;

Amplify.configure(awsmobile);


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
        if(!!ENV.guest_user_name && !!ENV.guest_password) {
          await Auth.signIn(ENV.guest_user_name, ENV.guest_password);
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

class App extends React.Component {
  constructor(props) {
    super(props);
    Hub.listen('auth', data => 
      console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event) ||
      this.onAuthEvent(data)             
    )
  }

  state = {
    fontLoaded: false,
    currentUser: undefined
  };

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
      case 'signIn':
        setTimeout(this._handleSignIn.bind(this), 200);
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