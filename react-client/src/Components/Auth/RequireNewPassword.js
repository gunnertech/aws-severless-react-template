/* eslint-disable */
import React, { useState, useEffect } from 'react';

import Auth from '@aws-amplify/auth';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import { PasswordField, CustomField, UsernameField } from "./Fields"


  

const RequireNewPassword = ({
  initialUsernameValue = "",
  onValueChange,
  onAuthStateChange,
  customFields = {},
  usernameField = "email",
  order=['username','name','password'],
  authData
}) => {
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [usernameValue, setUsernameValue] = useState(initialUsernameValue);
  const [usernameValid, setUsernameValid] = useState(false);
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
    onValueChange('password', passwordValue)
  }, [passwordValue])

  useEffect(() => {
    Object.entries(customsValue).forEach(([key, value]) => 
      onValueChange(key, value)
    )
  }, [JSON.stringify(customsValue)])

  useEffect(() => {
    setIsValid(
      passwordValid &&
      usernameValid &&
      Object.values(customsValid).every(value => !!value)
    );
  }, [usernameValid, passwordValid, JSON.stringify(customsValid)]);

  useEffect(() => {
    !!loading &&
    Auth.completeNewPassword(authData, passwordValue, customsValue)
      .then(user => (
        user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA' ? (
          Promise.resolve(onAuthStateChange("confirmsignin")).then(() => null)
        ) : user.challengeName === 'NEW_PASSWORD_REQUIRED' ? (
          Promise.resolve(onAuthStateChange("requirenewpassword")).then(() => null)
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
      .catch(console.log)
  }, [loading])

  return (
    <form noValidate autoComplete="off">
      {
        order
        .map(slug => 
          slug === 'username' ? (
            <UsernameField 
              key={slug}
              disabled={!!initialUsernameValue}
              value={usernameValue} 
              usernameField={usernameField} 
              onValueChange={setUsernameValue}
              onValidChange={setUsernameValid}
              showValidators={false}
            />
          ) : slug === 'password' ? (
            <PasswordField
              label={"New Password"}
              key={slug}
              value={passwordValue} 
              onValueChange={setPasswordValue}
              onValidChange={setPasswordValid}
              showValidators={true}
              helperText={
                <Typography variant="caption">
                  Enter your new password
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
              showValidators={true}
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
        Change
      </Button>
      <Typography align="center" variant="overline">
        <Typography onClick={() => onAuthStateChange('signin')} color="secondary" component={"a"} variant="overline">Back to Signin</Typography>
      </Typography>
    </form>
  )
}


export default RequireNewPassword;