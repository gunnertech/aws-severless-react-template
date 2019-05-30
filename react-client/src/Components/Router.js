import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomeScreen from "../Screens/Home";
import SplashScreen from "../Screens/Splash";
import PrivacyPolicyScreen from "../Screens/PrivacyPolicy";
import SignOutScreen from "../Screens/SignOut";

import { LayoutProvider } from '../Contexts/Layout'

import PrivateRoute from './PrivateRoute'

const Router = () => 
  <BrowserRouter>
    <LayoutProvider showNav={true}>
      <Switch>
        <Route path='/' exact component={SplashScreen} />
        <Route path='/sign-out' exact component={SignOutScreen} />
        <Route path='/privacy-policy' exact component={PrivacyPolicyScreen} />
        <PrivateRoute path='/home' exact component={HomeScreen} />
      </Switch>
    </LayoutProvider>
  </BrowserRouter>

export default Router;