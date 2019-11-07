import React from 'react';
import { SafeAreaView } from 'react-navigation'

import { StyleSheet } from 'react-native'
import makeStyles from '../Hooks/makeStyles';



const useStyles = makeStyles(theme => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: theme.palette.canvasColor
  }
}));

export default Container = ({children}) => {
  const classes = useStyles();
  return (
    <SafeAreaView style={classes.container}>
      {children}
    </SafeAreaView>
  )
}


