import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
// import { SignUp, SignIn, ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';
import HomeScreen from '../Screens/Home';
import SignOut from '../Screens/SignOut';
import SignIn from '../Screens/SignIn';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeNavigator = createStackNavigator({
  Home: {screen: createStackNavigator({
    HomeScreen,
  }, {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }),
  },
}, {
  mode: "modal", headerMode: "none"
});

HomeNavigator.navigationOptions = {
  drawerLabel: "Home",
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="home"
      color={tintColor}
      size={16}
    />
  ),
}

const screens = {
  Home: {
    screen: HomeNavigator
  },
  SignOut,
  SignIn
}

const DrawerNavigator = createDrawerNavigator(screens, {
  // drawerWidth: 300,
  initialRouteName: 'Home'
});


const GatedComponent = ({children}) => children

// const GatedComponentWithAuth = withAuthenticator(GatedComponent, false, [
//   <SignIn />,
//   <ConfirmSignIn />,
//   <VerifyContact />,
//   <SignUp
//     signUpConfig={{
//       hideAllDefaults: true,
//       signUpFields: [
//         {
//           key: 'username',
//           type: 'email',
//           required: true,
//           label: 'Email',
//           displayOrder: 2,
//           placeholder: "Enter your email (used to sign in)"
//         },
//         {
//           key: 'name',
//           type: 'text',
//           required: true,
//           label: 'Name',
//           displayOrder: 1,
//           placeholder: "Enter the name you want others to see"
//         },
//         {
//           key: 'password',
//           type: 'password',
//           required: true,
//           label: 'Password',
//           displayOrder: 3,
//           placeholder: "Enter your password"
//         }
//       ]
//     }}
//   />,
//   <ConfirmSignUp/>,
//   <ForgotPassword/>,
//   <RequireNewPassword />
// ], false, theme.amplify);

const GatedNavigator = ({navigation}) =>
  <GatedComponent>
    <DrawerNavigator navigation={navigation} />
  </GatedComponent>

GatedNavigator.router = DrawerNavigator.router;

export default GatedNavigator;