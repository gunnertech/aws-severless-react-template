import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";

import { CurrentUserContext } from '../Contexts/CurrentUser'


const AdminRoute = ({ component: Component, ...rest }) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Route {...rest} render={props => 
      !!currentUser && 
      currentUser.groups.includes("Admins") ? (
        <Component {...props} />
      ) : (
        <Redirect to='/home' />
      )
    } />
  )
}

export default AdminRoute;