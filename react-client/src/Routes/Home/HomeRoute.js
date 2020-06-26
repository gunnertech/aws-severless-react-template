import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { CurrentUserContext } from 'gunner-react'


const useStyles = makeStyles(theme => ({
  typography: {
    
  }
}));


const HomeRoute = () => {
  const classes = useStyles();
  const currentUser = useContext(CurrentUserContext);

  console.log(currentUser)


  return (
      <>
        <Typography className={classes.typography} paragraph>Welcome, {currentUser.name}!</Typography>
        <Typography paragraph>This is the start of a wonderful releationship.</Typography>
      </>  
  )
}


export default HomeRoute; 
