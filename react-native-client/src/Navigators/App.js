import { createStackNavigator } from 'react-navigation';


import GatedNavigator from './Gated';
import SplashScreen from '../Screens/Splash'
import SignOutScreen from '../Screens/SignOut'


export default createStackNavigator({
  Splash: SplashScreen,
  Gated: GatedNavigator,
  SignOut: SignOutScreen,
}, {
  headerMode: 'none'
});