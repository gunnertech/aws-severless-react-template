import React from 'react';
import { SafeAreaView, SafeAreaConsumer } from 'react-native-safe-area-context'
import useContainerStyles from './ContainerStyles';




export default Container = ({children}) => {
  const classes = useContainerStyles();
  return (
    <SafeAreaView style={classes.container}>
      {children}
    </SafeAreaView>
  )
}


