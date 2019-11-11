import React, { useContext, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';


import { Card, Button } from 'react-native-elements'

import Container from '../../Components/Container'

import { CurrentUserContext } from '../../Contexts/CurrentUser';
import makeStyles from '../../Hooks/makeStyles';

const useStyles = makeStyles(theme => StyleSheet.create({
  welcomeContainer: {
    marginBottom: theme.spacing.xl,
  }
}));



export default Splash = ({navigation}) => {
  const currentUser = useContext(CurrentUserContext);
  const classes = useStyles();

  useEffect(() => {
    !!currentUser &&
    navigation.navigate("Gated")
  }, [currentUser])
  
  return (
    <Container>
      <Card>
        <View style={classes.welcomeContainer}>
          <Text>Welcome! Please sign in or create an account!</Text>
        </View>
        <Button 
          onPress={() => navigation.navigate("Gated")} 
          primary 
          title="Sign In" 
          icon={
            <Icon
              name="sign-in"
              color="white"
            />
          }
          raised
        />
        <Button 
          type="clear"
          title='Privacy Policy'
          onPress={() => navigation.navigate('Privacy')}
        />
      </Card>
    </Container>
  )
}