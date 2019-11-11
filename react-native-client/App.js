import React, { useState, useEffect } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
// import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';

import * as Font from 'expo-font';
import Sentry from 'sentry-expo';
import { ThemeProvider } from 'react-native-elements';
import AppNavigator from './src/Navigators/App'
import muiTheme from './src/Styles/combinedTheme'
import getElementsTheme from './src/Styles/elementsTheme'
import ENV from './src/environment'
import { MemoryStorageNew } from './MemoryStorageNew';


import { CurrentUserProvider } from './src/Contexts/CurrentUser'


import { I18n } from 'aws-amplify';
import awsmobile from './aws-exports';
import useAppSyncClient from './src/Hooks/useAppSyncClient';
import userCurrentUser from './src/Hooks/useCurrentUser';



Amplify.configure({
  ...awsmobile,
  storage: MemoryStorageNew
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




// Branch.subscribe(bundle =>
//   bundle && bundle.params && !bundle.error && bundle.params && bundle.params.user && (
//     Cache.setItem('inviteInputs', bundle.params.user)
//   )
// )

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

if(!!ENV.sentry_url && !!ENV.sentry_url.replace("<sentry-url>","")) {
  Sentry.enableInExpoDevelopment = false;
  Sentry.config(ENV.sentry_url).install();
}


console.disableYellowBox = true;




const App = () => {
  const [cognitoUser, setCognitoUser] = useState(undefined);
  const [fontLoaded, setFontLoaded] = useState(false);
  const client = useAppSyncClient();
  const currentUser = userCurrentUser(cognitoUser);

  useEffect(() => {
    Font.loadAsync({
      'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
    })
      .then(() => setFontLoaded(true))
  }, [])

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(cognitoUser => setCognitoUser(cognitoUser))
      .catch(err => console.log(err) || setCognitoUser(null))
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

  return (
    !fontLoaded ? null :
    <ApolloProvider client={client}>
      {/* <Rehydrated> */}
        <CurrentUserProvider currentUser={currentUser}>
          <ThemeProvider theme={getElementsTheme(muiTheme)}>
            {
              typeof(currentUser) === 'undefined' ? (
                <></>
              ) : (
                <AppNavigator />
              )
            }
          </ThemeProvider>
        </CurrentUserProvider>
      {/* </Rehydrated> */}
    </ApolloProvider>
  );
}

export default App