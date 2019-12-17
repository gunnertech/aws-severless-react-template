import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomeRoute from "./Home";
import SplashRoute from "./Splash";
import PrivacyPolicyRoute from "./PrivacyPolicy";
import SignOutRoute from "./SignOut";
import SignInRoute from "./SignIn";

import { LayoutProvider } from '../Contexts/Layout'

import { useTracker } from '../Hooks/useTracker';

import PrivateRoute from './PrivateRoute'

const Router = () => 
  <BrowserRouter>
    <LayoutProvider showNav={true}>
      <Switch>
        <Route path='/' exact component={useTracker(SplashRoute)} />
        <Route path='/sign-out' exact component={useTracker(SignOutRoute)} />
        <Route path='/privacy-policy' exact component={useTracker(PrivacyPolicyRoute)} />
        <PrivateRoute path='/home' exact component={useTracker(HomeRoute)} />
        <PrivateRoute path='/sign-in' exact component={useTracker(SignInRoute)} />
      </Switch>
    </LayoutProvider>
  </BrowserRouter>

export default Router;