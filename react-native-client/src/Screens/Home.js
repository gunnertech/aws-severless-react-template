import React from 'react'

import { View, ScrollView } from 'react-native'
import {
  Toolbar
} from 'react-native-material-ui';

import { Card, Text } from 'react-native-elements'
import { compose } from 'react-apollo';

import { withMuiTheme } from '../Styles/muiTheme';
import withCurrentUser from '../Hocs/withCurrentUser';
import Container from '../Components/Container'





const styles = theme => ({
  cardContainer: {
    // padding: theme.spacing.sm,
    // flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.md
  },
  commentButtonContainer: {
    marginTop: theme.spacing.xl
  }
});

class Home extends React.PureComponent {
  static navigationOptions = navigationProps => ({
    header: <Toolbar
      leftElement={
        "menu"
      }
      centerElement={
        "gotseason8sucks9"
      }
      onLeftElementPress={() => navigationProps.navigation.toggleDrawer() }
    />
  })

  state = {
    
  }


  render() {
    const { classes, currentUser } = this.props;
    return !currentUser ? null : (
      <Container>
        <ScrollView>

        <Card style={{container: classes.cardContainer}}>
          <View>
            <Text>Welcome to your new project, {currentUser.name}</Text>
          </View>
        </Card>
        </ScrollView>
      </Container>
    )
  }
}


export default compose(
  withCurrentUser(),
  withMuiTheme(styles),
)(Home);
