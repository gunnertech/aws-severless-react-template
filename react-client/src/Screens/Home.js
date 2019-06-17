import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Container from '../Components/Container'

import { CurrentUserContext } from '../Contexts/CurrentUser'

const useStyles = makeStyles(theme => ({
  typography: {
    
  }
}));


const Home = () => {
  const classes = useStyles();
  const currentUser = useContext(CurrentUserContext);

  return (
    <Container>
      <div>
        <Typography className={classes.typography} paragraph>Welcome, {currentUser.name}!</Typography>
        <Typography paragraph>This is the start of a wonderful releationship.</Typography>
      </div>  
    </Container>
  )
}


export default Home; 
