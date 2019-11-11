import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { SignUp, SignIn, ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';
import Home from '../Screens/Home';
import SignOut from '../Screens/SignOut';
import theme from '../Styles/combinedTheme'


const screens = {
  Home: {
    screen: createStackNavigator({
      Home,
    })
  },
  SignOut
}

const DrawerNavigator = createDrawerNavigator(screens, {
  drawerWidth: 300,
  initialRouteName: 'Home'
});


const GatedComponent = ({children}) => children

const GatedComponentWithAuth = withAuthenticator(GatedComponent, false, [
  <SignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <SignUp
    signUpConfig={{
      hideAllDefaults: true,
      signUpFields: [
        {
          key: 'username',
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
          key: 'password',
          type: 'password',
          required: true,
          label: 'Password',
          displayOrder: 3,
          placeholder: "Enter your password"
        }
      ]
    }}
  />,
  <ConfirmSignUp/>,
  <ForgotPassword/>,
  <RequireNewPassword />
], false, theme.amplify);

const GatedNavigator = ({navigation}) => 
  <GatedComponentWithAuth>
    <DrawerNavigator navigation={navigation} />
  </GatedComponentWithAuth>

GatedNavigator.router = DrawerNavigator.router;

export default GatedNavigator;