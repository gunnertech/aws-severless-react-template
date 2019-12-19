import { createAppContainer } from 'react-navigation';

import { createStackNavigator, } from 'react-navigation-stack';

import GatedNavigator from './Gated';
import SplashScreen from '../Screens/Splash'
import SignOutScreen from '../Screens/SignOut'
import PrivacyScreen from '../Screens/Privacy';
import SignInScreen from '../Screens/SignIn';


export default createAppContainer(createStackNavigator({
  Splash: SplashScreen,
  Gated: GatedNavigator,
  SignOut: SignOutScreen,
  SignIn: createStackNavigator({ModalSignIn: {screen: SignInScreen}}, {mode: "modal", headerMode: "none"}),
  Privacy: createStackNavigator({PrivacyScreen})
}, {
  headerMode: 'none',
}));