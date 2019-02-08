import { createStackNavigator } from 'react-navigation';


import GatedNavigator from './Gated';
import SplashScreen from '../Screens/Splash'
import SignOutScreen from '../Screens/SignOut'
import PrivacyScreen from '../Screens/Privacy';


export default createStackNavigator({
  Splash: SplashScreen,
  Gated: GatedNavigator,
  SignOut: SignOutScreen,
  Privacy: PrivacyScreen
}, {
  headerMode: 'none'
});