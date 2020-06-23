import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";

import { CurrentUserContext } from 'gunner-react'


const AdminRoute = ({ component: Component, ...rest }) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Route {...rest} render={props => 
      !!currentUser && 
      /Admins/.test(currentUser.groups.join(",")) ? (
        <Component {...props} />
      ) : (
        <Redirect to='/home' />
      )
    } />
  )
}

export default AdminRoute;