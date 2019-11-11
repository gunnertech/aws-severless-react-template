import React from 'react';
import { SafeAreaView } from 'react-navigation'
import useContainerStyles from './ContainerStyles';




export default Container = ({children}) => {
  const classes = useContainerStyles();
  return (
    <SafeAreaView style={classes.container}>
      {children}
    </SafeAreaView>
  )
}


