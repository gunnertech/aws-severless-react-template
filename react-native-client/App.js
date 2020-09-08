import React, { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import * as Linking from 'expo-linking'

import AppNavigator from './src/Navigators/App'
import getElementsTheme from './src/Styles/elementsTheme'
import ENV from './src/environment'


import { I18n } from 'aws-amplify';
import awsmobile from './aws-exports';
import Constants from 'expo-constants';
// import { App } from 'gunner-react'
import { App } from 'gunner-react/native'
import useFindUser from "react-shared/Hooks/useFindUser"
import useCreateUser from "react-shared/Hooks/useCreateUser"
import useNotificationPermissions from 'Hooks/useNotificationPermissions';


Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;


const authScreenLabels = {
  en: {
    "Username": "Email",
    "Enter your username": "Enter your email",
    'Sign Up': 'Create new account',
    'Sign Up Account': 'Create a new account',
    'Confirm Sign Up': 'Confirm Sign Up by entering the code that was sent to your email address'
  }
};

const prefix = Linking.makeUrl('/');
const initialState = {
  prefixes: [prefix],
  config: {
    ShudiDetail: 'shudis/:id',
    Activity: {
      initialRouteName: "ActivityList",
      screens: {
        ActivityDetail: 'activities/:id',
        ActivityList: 'activities',
      }
    }
  },
}

const fonts = {
  'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
}


I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

console.disableYellowBox = true;


const BranchNav = () => {
  useEffect(() => {
    Constants.appOwnership === 'standalone' &&
    import('expo-branch')
      .then(({default: Branch}) =>
        Branch.subscribe(bundle =>
          !bundle?.error && !!bundle?.params?.params && (
            Linking.openURL(
              Linking.makeUrl(`thumbwars/${JSON.parse(bundle?.params?.params).id}`, { })
            )
          )
        )
      )
  }, [])
  return null
}


export default () => {
  return (
    <App 
      fonts={fonts}
      initialState={initialState}
      getElementsTheme={getElementsTheme} 
      useCreateUser={useCreateUser} 
      useFindUser={useFindUser}
      useNotificationPermissions={useNotificationPermissions}
      sentryUrl={ENV.sentry_url?.replace?.("<sentry-url>","")} 
      amplifyConfig={awsmobile} 
      ga={""}
    >
      <>
        <BranchNav />
        <AppNavigator />
      </>
    </App>
  )
}