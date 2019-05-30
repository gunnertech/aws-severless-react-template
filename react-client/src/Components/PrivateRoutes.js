import React from 'react';
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, VerifyContact, withAuthenticator } from 'aws-amplify-react';
import { Route } from "react-router-dom";

import SignUp from "../Screens/SignUp";
import SignIn from "../Screens/SignIn";


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    const ComponentWithAuth = withAuthenticator(Component, false, [
      <SignIn/>,
      <ConfirmSignIn/>,
      <VerifyContact/>,
      <SignUp

        signUpConfig={{
          hideAllDefaults: true,
          signUpFields: [
            {
              key: 'email',
              type: 'email',
              required: true,
              label: 'Email',
              displayOrder: 1,
              placeholder: "Enter your email (used to sign in)"
            },
            {
              key: 'password',
              type: 'password',
              required: true,
              label: 'Password',
              displayOrder: 2,
              placeholder: "Enter your password"
            },
            {
              key: 'given_name',
              type: 'text',
              required: true,
              label: 'First Name',
              displayOrder: 3,
              placeholder: "First Name"
            },
            {
              key: 'family_name',
              type: 'text',
              required: true,
              label: 'Last Name',
              displayOrder: 4,
              placeholder: "Last Name"
            },
            {
              key: 'phone_number',
              type: 'text',
              required: true,
              label: 'Phone Number',
              displayOrder: 5,
              placeholder: "Enter your phone number"
            },
            {
              key: 'address',
              type: 'text',
              required: true,
              label: 'Address',
              displayOrder: 6,
              placeholder: "Enter your address"
            },
            {
              key: 'custom:address2',
              type: 'text',
              required: false,
              label: 'Address 2',
              displayOrder: 7,
              placeholder: "Enter your address"
            },
            {
              key: 'custom:city',
              type: 'text',
              required: true,
              label: 'City',
              displayOrder: 8,
              placeholder: "Enter your city"
            },
            {
              key: 'custom:state',
              type: 'text',
              required: true,
              label: 'State',
              displayOrder: 9,
              placeholder: "Enter your state"
            },
            {
              key: 'custom:zip',
              type: 'text',
              required: true,
              label: 'Zip',
              displayOrder: 10,
              placeholder: "Enter your zip code"
            },
            {
              key: 'birthdate',
              type: 'text',
              required: true,
              label: 'Birthdate',
              displayOrder: 11,
              placeholder: "MM/DD/YYYY"
            },
          ]
      }}
    />,
    <ConfirmSignUp/>,
    <ForgotPassword/>,
    <RequireNewPassword />
  ], false);

    return (
      <ComponentWithAuth {...props} />
    )
  }} />
)

export default PrivateRoute;