import { createAppContainer } from 'react-navigation';

import { createStackNavigator, } from 'react-navigation-stack';

import GatedNavigator from './Gated';
import SplashScreen from '../Screens/Splash'
import SignOutScreen from '../Screens/SignOut'
import PrivacyScreen from '../Screens/Privacy';


export default createAppContainer(createStackNavigator({
  Splash: SplashScreen,
  Gated: GatedNavigator,
  SignOut: SignOutScreen,
  Privacy: createStackNavigator({PrivacyScreen})
}, {
  headerMode: 'none'
}));