import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomeScreen from "../Screens/Home";
import SplashScreen from "../Screens/Splash";
import PrivacyPolicyScreen from "../Screens/PrivacyPolicy";
import SignOutScreen from "../Screens/SignOut";
import SignInScreen from "../Screens/SignIn";

import { LayoutProvider } from '../Contexts/Layout'

import { useTracker } from '../Hooks/useTracker';

import PrivateRoute from './PrivateRoute'

const Router = () => 
  <BrowserRouter>
    <LayoutProvider showNav={true}>
      <Switch>
        <Route path='/' exact component={SplashScreen} />
        <Route path='/sign-out' exact component={SignOutScreen} />
        <Route path='/privacy-policy' exact component={PrivacyPolicyScreen} />
        <PrivateRoute path='/home' exact component={HomeScreen} />
        <PrivateRoute path='/sign-in' exact component={SignInScreen} />
      </Switch>
    </LayoutProvider>
  </BrowserRouter>

export default Router;