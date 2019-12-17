import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { CurrentUserContext } from '../../Contexts/CurrentUser'
import { useQuery } from 'react-apollo';
import User from '../../api/User';

const useStyles = makeStyles(theme => ({
  typography: {
    
  }
}));


const HomeRoute = () => {
  const classes = useStyles();
  const currentUser = useContext(CurrentUserContext);

  const {loading, error, data: {getUser}} = useQuery(User.queries.list, {variables: {
    limit: 100
  }});

  console.log(loading, error, getUser)

  return (
      <>
        <Typography className={classes.typography} paragraph>Welcome, {currentUser.name}!</Typography>
        <Typography paragraph>This is the start of a wonderful releationship.</Typography>
      </>  
  )
}


export default HomeRoute; 
