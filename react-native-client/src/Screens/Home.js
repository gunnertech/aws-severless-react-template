import React, { useContext } from 'react'

import { View, ScrollView, StyleSheet } from 'react-native'
import { Header, Card, Text  } from 'react-native-elements';


import Container from '../Components/Container'
import makeStyles from '../Hooks/makeStyles';
import { CurrentUserContext } from '../Contexts/CurrentUser';


const useStyles = makeStyles(theme => StyleSheet.create({
  buttonContainer: {
    marginTop: theme.spacing.md
  },
  commentButtonContainer: {
    marginTop: theme.spacing.xl
  }
}));

const Home = ({navigation}) => {
  const classes = useStyles();
  const currentUser = useContext(CurrentUserContext);

  return !currentUser ? null : (
    <Container>
      <ScrollView>

      <Card style={{container: classes.cardContainer}}>
        <View>
          <Text>Welcome to your new project, {currentUser.attributes.name}</Text>
        </View>
      </Card>
      </ScrollView>
    </Container>
  )
}

Home.navigationOptions = screenProps => ({
  header: <Header
    leftComponent={{
      icon: "menu",
      onPress: () => screenProps.navigation.toggleDrawer()
    }}
    centerComponent={{
      text: "Shudi"
    }}
  />
});

export default Home