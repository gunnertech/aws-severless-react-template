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

  render() {
    const { classes, theme } = this.props;
    return (
      <Container>
        <Card>
          <View>
            <Text style={{paddingBottom: theme.spacing.sm}}>Welcome! Please sign in or create an account!</Text>
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