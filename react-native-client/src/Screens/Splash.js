import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-elements'
import {
  Button,
  // Card,
} from 'react-native-material-ui';

import { Card } from 'react-native-elements'

import { withMuiTheme } from '../Styles/muiTheme';
import Container from '../Components/Container'
import withCurrentUser from '../Hocs/withCurrentUser'

import ENV from '../environment'

const styles = theme => ({
  commentButtonContainer: {
    marginTop: theme.spacing.xl
  }
});

class Splash extends React.Component {

  componentDidMount() {
    if(this.props.currentUser) {
      this.props.navigation.navigate("Gated")
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentUser) {
      this.props.navigation.navigate("Gated")
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <Container>
        <Card>
          <View>
            {
              !!ENV.bucket.match(/staging/) &&
              <Text style={{paddingBottom: theme.spacing.sm}}>*****This is Staging*****</Text>
            }
            <Text style={{paddingBottom: theme.spacing.sm}}>SimpliSurvey is a tool for interpreting real time customer satisfaction and analysis.</Text>
            <Text style={{paddingBottom: theme.spacing.sm}}>It works by polling customers with a simple algorithm and presenting findings on an easy to use dashboard.</Text>
            <Text style={{paddingBottom: theme.spacing.sm}}>To send a survey, sign in with your account or, if you were invited, register for a new account using the email address and/or phone number where you received the invitation.</Text>
          </View>
          <Button onPress={() => this.props.navigation.navigate("Gated")} style={{container: classes.commentButtonContainer}} primary text="Sign In" iconSet="FontAwesome" icon="sign-in" raised />
          <Button 
            text='Privacy Policy'
            onPress={ () =>
              this.props.navigation.navigate('Privacy')
            }
          />
        </Card>
      </Container>
    )
  }
}

export default withCurrentUser()(withMuiTheme(styles)(Splash))