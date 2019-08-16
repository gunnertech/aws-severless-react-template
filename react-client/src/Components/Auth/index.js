import React, { useState, useEffect } from 'react';
import SignUp from "./SignUp"
import SignIn from "./SignIn"
import ForgotPassword from "./ForgotPassword"
import ConfirmSignUp from "./ConfirmSignUp"
import Snackbar from "./Components/Snackbar"

import queryString from 'query-string'
import RequireNewPassword from './RequireNewPassword';

const Complete = ({onComplete}) => {
  useEffect(() => {
    onComplete()
  }, []);

  return null
}

const Auth = ({
  onComplete,
  location: {search = ""} = {},
  initialAuthState = "signup", 
  usernameField = "email",
  initialUsernameValue = "",
  initialPasswordValue = "",
  customFields = {
    "name": {
      label: "Name",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {
        "Can't be blank": /^.+$/
      }
    }    
  }
}) => {
  const [authState, setAuthState] = useState(queryString.parse(search).authState || initialAuthState);
  const [message, setMessage] = useState({});
  const [authData, setAuthData] = useState({});
  const [values, setValues] = useState({
    username: initialUsernameValue,
    password: initialPasswordValue,
    ...Object.entries(customFields).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value.initialValue || ""
    }), {})
  });
  
  const getValues = () => values


  return (
    <>
      {
        !!message &&
        !!message.message &&
        <Snackbar 
          message={message.message} 
          type={message.type || 'info'} 
          forceOpen={!!message.message} 
        />
      }
      {
        authState === "signup" ? (
          <SignUp
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            initialUsernameValue={values.username}
            initialPasswordValue={values.password} 
            usernameField={usernameField}
            order={['username', 'name', 'password']}
            customFields={customFields}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
            getValues={getValues}
          />
        ) : authState === "signin" ? (
          <SignIn
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            initialUsernameValue={values.username}
            initialPasswordValue={values.password} 
            usernameField={usernameField}
            order={['username','password']}
            onAuthStateChange={(authState, message, authData) => [setAuthState(authState), setMessage(message), setAuthData(authData)]}
          />
        ) : authState === "forgotpassword" ? (
          <ForgotPassword
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            usernameField={usernameField}
            order={['username', 'code', 'password']}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
          />
        ) : authState === "confirmsignup" ? (
          <ConfirmSignUp
            initialUsernameValue={values.username}
            usernameField={usernameField}
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
          />
        ) : authState === "requirenewpassword" ? (
          <RequireNewPassword
            initialUsernameValue={values.username}
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
            usernameField={usernameField}
            order={['username', 'name', 'password']}
            customFields={customFields}
            authData={authData}
          />
        ) : (
          <Complete onComplete={onComplete} />
        )
      }
    </>
  )
}

export default Auth