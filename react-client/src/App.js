import React, { useState, useEffect } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { ApolloProvider } from 'react-apollo';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Router from "./Routes"


import { CurrentUserProvider } from './Contexts/CurrentUser'
import { ActionMenuProvider } from './Contexts/ActionMenu';
import useCurrentUser from './Hooks/useCurrentUser';
import useAppSyncClient from './Hooks/useAppSyncClient';



import { I18n } from 'aws-amplify';

import awsmobile from './aws-exports';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    // fontSize: 18,
    // subtitle1: {
    //   color: "#EF4035" 
    // }
  },
  palette: {
    // primary: {
    //   main: "#222222"
    // },
    // secondary: {
    //   main: "#EF4035"
    // }
  }
});



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


if(!!process.env.REACT_APP_sentry_url && !!process.env.REACT_APP_sentry_url.replace("<sentry-url>","")) {
  Sentry.enableInExpoDevelopment = false;
  Sentry.init({
    dsn: process.env.REACT_APP_sentry_url
  });
}

if(!!process.env.REACT_APP_GA) {
  ReactGA.initialize(process.env.REACT_APP_GA);
}

Amplify.configure(awsmobile);


const CurrentUser = ({cognitoUser, children}) => {
  const currentUser = useCurrentUser(cognitoUser);

  return children(currentUser)
}


const App = () => {
  const [cognitoUser, setCognitoUser] = useState(undefined);
  const appsyncClient = useAppSyncClient(cognitoUser);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(cognitoUser => setCognitoUser(cognitoUser))
      .catch(err => setCognitoUser(null))
  }, []);

  useEffect(() => {
    const onAuthEvent = capsule => {
      switch (capsule.payload.event) {
        case 'signOut':
          setCognitoUser(null);
          break;
        case 'signIn_failure':
        case 'signUp_failure':
          break;
        case 'signIn':
            setCognitoUser(capsule.payload.data);
          break;
        default:
          break;
      }
    }

    Hub.listen('auth', onAuthEvent);

    return () =>
      Hub.remove(('auth', onAuthEvent))
  }, []);


  return ( !appsyncClient ? null :
    <ApolloProvider client={appsyncClient}>
      {/* <Rehydrated> */}
      <MuiThemeProvider theme={theme}>
        <CurrentUser cognitoUser={cognitoUser}>
          {currentUser =>
            <CurrentUserProvider currentUser={currentUser}>
              {
                typeof(currentUser) === 'undefined' ? (
                  null
                ) : (
                  <ActionMenuProvider>
                    <Router />
                  </ActionMenuProvider>
                )
              }
            </CurrentUserProvider>
          }
        </CurrentUser>
      </MuiThemeProvider>
      {/* </Rehydrated> */}
    </ApolloProvider>
  );
}


export default App;