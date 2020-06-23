import React from 'react'

import { createStackNavigator, } from '@react-navigation/stack';

import DrawerNavigator from './Drawer';
import BlockedScreen from '../Screens/Blocked';
import useLocation from 'Hooks/useLocation';

const Stack = createStackNavigator();


export default () => {
  const geoAllowed = useLocation();
  return geoAllowed === null ? (
    null 
  ) : !!geoAllowed || true ? (
    // <Stack.Navigator headerMode="none">
    //   <Stack.Screen name="Drawer" component={DrawerNavigator} />
    // </Stack.Navigator>
    <DrawerNavigator />
  ) : (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Blocked" component={BlockedScreen} />
    </Stack.Navigator>
  )
}
