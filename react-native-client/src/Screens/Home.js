import React from 'react'
import { View, Text } from 'react-native'
import {
  Button,
  Card,
  Toolbar
} from 'react-native-material-ui';

import withCurrentUser from '../Hocs/withCurrentUser'
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

class Home extends React.Component {
  static navigationOptions = navigationProps => ({
    header: <Toolbar
      leftElement={
        "menu"
      }
      centerElement={
        "Home"
      }
      onLeftElementPress={() => navigationProps.navigation.toggleDrawer() }
    />
  })

  render() {
    const { classes, currentUser } = this.props;
    return (
      <Container>
        <Card style={{container: classes.cardContainer}}>
          <View><Text>Welcome {currentUser.username}</Text></View>
          <Button onPress={() => this.props.navigation.navigate("SignOut")} style={{container: classes.commentButtonContainer}} primary text="Sign Out" icon="exit-to-app" raised />
        </Card>
      </Container>
    )
  }
}

export default withCurrentUser()(withMuiTheme(styles)(Home));