import React, { useState, useEffect } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
// import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

import * as Font from 'expo-font';
import { FormattedProvider } from 'react-native-globalize';
// import * as Sentry from 'sentry-expo';

import { ThemeProvider } from 'react-native-elements';
import AppNavigator from './src/Navigators/App'
import muiTheme from './src/Styles/combinedTheme'
import getElementsTheme from './src/Styles/elementsTheme'
import ENV from './src/environment'
// import { MemoryStorageNew } from './MemoryStorageNew';


import { CurrentUserProvider } from './src/Contexts/CurrentUser'


import { I18n } from 'aws-amplify';
import awsmobile from './aws-exports';
import useAppSyncClient from './src/Hooks/useAppSyncClient';
import useCurrentUser from './src/Hooks/useCurrentUser';



Amplify.configure({
  ...awsmobile,
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
  // Sentry.init({
  //   dsn: ENV.sentry_url,
  //   enableInExpoDevelopment: true,
  //   debug: true
  // });
}


console.disableYellowBox = true;

const CurrentUser = ({cognitoUser, children}) => {
  const currentUser = useCurrentUser(cognitoUser);

  return children(currentUser)
}


const App = () => {
  const [cognitoUser, setCognitoUser] = useState(undefined);
  const [fontLoaded, setFontLoaded] = useState(false);
  const client = useAppSyncClient(cognitoUser);

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
    !client ? null :
    <ApolloProvider client={client}>
      {/* <Rehydrated> */}
      <ActionSheetProvider>
      <CurrentUser cognitoUser={cognitoUser}>
        {currentUser =>
          <CurrentUserProvider currentUser={currentUser}>
            <ThemeProvider theme={getElementsTheme(muiTheme)}>
              <FormattedProvider locale="en" currency="USD">
                {
                  typeof(currentUser) === 'undefined' ? (
                    <></>
                  ) : (
                    <AppNavigator />
                  )
                }
              </FormattedProvider>
            </ThemeProvider>
          </CurrentUserProvider>
        }
      </CurrentUser>
      </ActionSheetProvider>
      {/* </Rehydrated> */}
    </ApolloProvider>
  );
}

export default App