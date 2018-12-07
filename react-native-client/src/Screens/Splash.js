import React from 'react'
import { View, Text } from 'react-native'
import {
  Button,
  // Card,
} from 'react-native-material-ui';

import { Card } from 'react-native-elements'

import { withMuiTheme } from '../Styles/muiTheme';
import Container from '../Components/Container'
import withCurrentUser from '../Hocs/withCurrentUser'

const styles = theme => ({
  commentButtonContainer: {
    marginTop: theme.spacing.xl
  }
});

class Splash extends React.Component {
  componentDidUpdate() {
    if(this.props.currentUser) {
      this.props.navigation.navigate("Gated")
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Card>
          <View><Text>Welcome to SimpliSurvey! To send a survey, sign in with your account or, if you were invited, register for a new account.</Text></View>
          <Button onPress={() => this.props.navigation.navigate("Gated")} style={{container: classes.commentButtonContainer}} primary text="Sign In" iconSet="FontAwesome" icon="sign-in" raised />
        </Card>
      </Container>
    )
  }
}

export default withCurrentUser()(withMuiTheme(styles)(Splash))