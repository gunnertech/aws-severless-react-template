import React from 'react';
import { createStackNavigator, createDrawerNavigator, SafeAreaView } from 'react-navigation';
import { Drawer } from 'react-native-material-ui';
// import { withAuthenticator } from 'aws-amplify-react-native';
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignIn, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';

// import AmplifyTheme from '../Styles/amplifyTheme'; theme={AmplifyTheme}
import Home from '../Screens/Home';
import SignOut from '../Screens/SignOut';
import SignUp from '../Screens/SignUp'
import theme from '../Styles/muiTheme'


const screens = {
  Home: {
    screen: createStackNavigator({
      Home,
    })
  },
  SignOut
}

class DrawerComponent extends React.Component {
  state = {
    active: 'Home'
  }

  mapNavItem(item) {
    return (
      Object.assign(({
        "Home": { icon: 'home', value: 'Home' },
        "SignOut": { icon: 'exit-to-app', value: 'Sign Out' },
      }[item.key] || {}), {
        onPress: () => 
          this.setState({
            active: item.key
          }, () => this.props.navigation.navigate(item.key) )
        ,
        active: (this.state.active === item.key)
      })
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Drawer>
          <Drawer.Section
            items={this.props.items.map(item => this.mapNavItem(item)).filter(item => !!item.value)}
          />
        </Drawer>
      </SafeAreaView>
      );
  }
}

class GatedComponent extends React.Component {
  render() {
    return (
      this.props.children
    )
  }
}

const DrawerNavigator = createDrawerNavigator(screens, {
  contentComponent: DrawerComponent,
  drawerWidth: 300,
  initialRouteName: 'Home'
});

const GatedComponentWithAuth = withAuthenticator(GatedComponent, false, [
  <SignIn/>,
  <ConfirmSignIn/>,
  <VerifyContact/>,
  <SignUp
    signUpConfig={{
      hideAllDefaults: true,
      signUpFields: [
        {
          key: 'email',
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

class GatedNavigator extends React.Component {
  static router = DrawerNavigator.router;

  render() {
    return (
      <GatedComponentWithAuth
        
      >
        <DrawerNavigator
          navigation={this.props.navigation}
        />
      </GatedComponentWithAuth>
    );
  }
}

export default GatedNavigator;