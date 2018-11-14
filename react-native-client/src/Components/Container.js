import React from 'react';
import { SafeAreaView } from 'react-navigation'

import { withMuiTheme } from '../Styles/muiTheme';

const styles = theme => ({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: theme.palette.canvasColor
  }
});

const Container = props =>
  <SafeAreaView style={props.classes.container}>
    {props.children}
  </SafeAreaView>


export default withMuiTheme(styles)(Container);