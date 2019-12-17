import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery } from '@apollo/react-hooks';
import User from '../../api/User';


const SplashRoute = () => {

  const {loading, error, data: {listUsers: {items = []} = {}} = {}} = useQuery(User.queries.list, {variables: {
    limit: 100
  }});

  console.log(loading, error, items)
  
  return (
    <Typography paragraph>Welcome. Doesn't look you have access, so why don't you create an account?</Typography>
  );
}

export default SplashRoute;