import React, { useContext } from 'react';
import { Route } from "react-router-dom";
import {withRouter} from 'react-router-dom';

import AuthScreen from "../Components/Auth"
import { CurrentUserContext } from '../Contexts/CurrentUser'

const PrivateRoute = ({ component: Component, location: {pathname}, ...rest }) => {
  const currentUser = useContext(CurrentUserContext);
  
        

  return (
    <Route {...rest} render={props => {
      return (
        !!currentUser ? (
          <Component {...props} />
        ) : (
          <AuthScreen />
        )
      )
    }} />
  )
}

export default withRouter(PrivateRoute);