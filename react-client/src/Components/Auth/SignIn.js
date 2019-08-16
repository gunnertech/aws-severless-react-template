import React, { useState, useEffect } from 'react';

import Auth from '@aws-amplify/auth';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import { PasswordField, CustomField, UsernameField } from "./Fields"


  

const SignIn = ({
  initialUsernameValue = "", 
  initialPasswordValue = "", 
  usernameField = "email", 
  customFields = {}, 
  order=['username', 'password'],
  onValueChange,
  onAuthStateChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [usernameValue, setUsernameValue] = useState(initialUsernameValue);
  const [usernameValid, setUsernameValid] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordValue, setPasswordValue] = useState(initialPasswordValue);
  const [passwordValid, setPasswordValid] = useState(false);
  const [customsValue, setCustomsValue] = useState(Object.entries(customFields).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value.initialValue || ""
  }), {}));

  const [customsValid, setCustomsValid] = useState(Object.entries(customFields).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: !!value.required ? false : true
  }), {}));

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    onValueChange('username', usernameValue)
  }, [usernameValue])

  useEffect(() => {
    onValueChange('password', passwordValue)
  }, [passwordValue])

  useEffect(() => {
    Object.entries(customsValue).forEach(([key, value]) => 
      onValueChange(key, value)
    )
  }, [JSON.stringify(customsValue)])

  useEffect(() => {
    setIsValid(
      usernameValid && 
      passwordValid &&
      Object.values(customsValid).every(value => !!value)
    );
  }, [usernameValid, passwordValid, JSON.stringify(customsValid)]);

  useEffect(() => {
    !!loading &&
    Auth.signIn(usernameValue, passwordValue)
      .then(user => (
        user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA' ? (
          Promise.resolve(onAuthStateChange("confirmsignin")).then(() => null)
        ) : user.challengeName === 'NEW_PASSWORD_REQUIRED' ? (
          Promise.resolve(onAuthStateChange("requirenewpassword", {type: "info", message: "You must choose a new password."}, user)).then(() => null)
        ) : user.challengeName === 'MFA_SETUP' ? (
          Promise.resolve(onAuthStateChange("totpsetup")).then(() => null)
        ) : user.challengeName === 'CUSTOM_CHALLENGE' ? (
          Promise.resolve(onAuthStateChange("customconfirmsignin")).then(() => null)
        ) : (
          user
        )
      ))
      .then(user => !user ? null :
        Auth.verifiedContact(user)
      )
      .then(data => !data ? null :
        !!Object.keys(data.verified).length ? ( // IF THE USER HAS AT LEAST ONE METHOD OF CONTACT VERIFIED
          onAuthStateChange('signedin')
        ) : (
          onAuthStateChange('verifycontact')
        )
      )
      .catch(e => [
        setUsernameError(e.message),
        setLoading(false)
      ])
  }, [loading])

  return (
    <form noValidate autoComplete="off">
      {
        order.map(slug => 
          slug === 'username' ? (
            <UsernameField 
              error={usernameError}
              key={slug}
              value={usernameValue} 
              usernameField={usernameField} 
              onValueChange={setUsernameValue}
              onValidChange={setUsernameValid}
              showValidators={false}
            />
          ) : slug === 'password' ? (
            <PasswordField
              key={slug}
              value={passwordValue} 
              onValueChange={setPasswordValue}
              onValidChange={setPasswordValid}
              showValidators={false}
              helperText={
                <Typography onClick={() => onAuthStateChange("forgotpassword")} color="secondary" component={"a"} variant="caption">
                  Reset Password
                </Typography>
              }
            />
          ) : (
            <CustomField
              key={slug}
              value={customsValue[slug]} 
              onValueChange={value => setCustomsValue({
                ...customsValue,
                [slug]: value
              })}
              onValidChange={valid => setCustomsValid({
                ...customsValid,
                [slug]: valid
              })}
              showValidators={false}
              customField={customFields[slug]}
            />
          )
        )
      }
      
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        disabled={!isValid || !!loading} 
        size="large"
        onClick={() => setLoading(true)}
      >
        Sign In
      </Button>
      <Typography align="left" variant="overline">
        No account?
        &nbsp;
        <Typography onClick={() => onAuthStateChange("signup")} color="secondary" size='small' component={'a'} variant="overline">Sign Up</Typography>
      </Typography>
    </form>
  )
}


export default SignIn;