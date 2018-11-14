import React from 'react'
import { View, Text } from 'react-native'
import {
  Button,
  Card,
} from 'react-native-material-ui';

import { withMuiTheme } from '../Styles/muiTheme';
import Container from '../Components/Container'

const styles = theme => ({
  cardContainer: {
    padding: theme.spacing.sm,
    flex: 1,
  },
  commentButtonContainer: {
    marginTop: theme.spacing.xl
  }
});

class Splash extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Card style={{container: classes.cardContainer}}>
          <View><Text>This is a splash screen. So you don't need to be logged in to see it</Text></View>
          <Button onPress={() => this.props.navigation.navigate("Gated")} style={{container: classes.commentButtonContainer}} primary text="Home" icon="home" raised />
        </Card>
      </Container>
    )
  }
}

export default withMuiTheme(styles)(Splash)