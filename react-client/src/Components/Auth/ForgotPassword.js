/* eslint-disable */
import React, { useState, useEffect } from 'react';

import Auth from '@aws-amplify/auth';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import { PasswordField, CodeField, CustomField, UsernameField } from "./Fields"


  

const ForgotPassword = ({
  initialUsernameValue = "",
  onValueChange,
  onAuthStateChange,
  customFields = {},
  usernameField = "email",
  order=['username', 'code', 'password'],
}) => {
  const [loading, setLoading] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [usernameValue, setUsernameValue] = useState(initialUsernameValue);
  const [usernameError, setUsernameError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [codeError, setCodeError] = useState("");
  
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
    onValueChange('code', codeValue)
  }, [codeValue])

  useEffect(() => {
    onValueChange('password', passwordValue)
  }, [passwordValue])

  useEffect(() => {
    onValueChange('username', usernameValue)
  }, [usernameValue])

  useEffect(() => {
    Object.entries(customsValue).forEach(([key, value]) => 
      onValueChange(key, value)
    )
  }, [JSON.stringify(customsValue)])

  useEffect(() => {
    setIsValid(
      submittingRequest ? (
        codeValid &&   
        passwordValid
      ) : (
        usernameValid
      ) &&
      Object.values(customsValid).every(value => !!value)
    );
  }, [usernameValid, codeValid, passwordValid, JSON.stringify(customsValid), submittingRequest]);

  useEffect(() => {
    !!submittingRequest &&
    Auth.forgotPassword(usernameValue)
      .then(() => [
        setUsernameError("")
      ])
      .catch(e => [
        setSubmittingRequest(false),
        setUsernameError(e.message)
      ])
  }, [submittingRequest]);

  useEffect(() => {
    !!loading &&
    Auth.forgotPasswordSubmit(usernameValue, codeValue, passwordValue)
      .then(data => [
        setLoading(false),
        setSubmittingRequest(false),
        onAuthStateChange('signin', {type: 'info', message: "Please use your new passsword to sign in."})
      ])
      .catch(e => [
        setLoading(false),
        setCodeError(e.message)
      ])
  }, [loading]);

  return (
    <form noValidate autoComplete="off">
      {
        order
        .filter(slug => submittingRequest ? slug !== 'username' : !['code', 'password'].includes(slug) )
        .map(slug => 
          slug === 'code' ? (
            <CodeField 
              key={slug}
              value={codeValue} 
              onValueChange={setCodeValue}
              onValidChange={setCodeValid}
              showValidators={false}
              error={codeError}
              helperText={"Enter the six digit code we just sent to your device."}
            />
          ) : slug === 'username' ? (
            <UsernameField 
              key={slug}
              value={usernameValue} 
              usernameField={usernameField} 
              onValueChange={setUsernameValue}
              onValidChange={setUsernameValid}
              showValidators={false}
              error={usernameError}
            />
          ) : slug === 'password' ? (
            <PasswordField
              label={"New Password"}
              key={slug}
              value={passwordValue} 
              onValueChange={setPasswordValue}
              onValidChange={setPasswordValid}
              showValidators={false}
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
        onClick={() => !submittingRequest ? setSubmittingRequest(true) : setLoading(true) }
      >
        {
          submittingRequest ? (
            'Submit'
          ) : (
            'Request Code'
          )
        }
      </Button>
      {
        submittingRequest &&
        <Typography align="center" variant="overline">
          No code?
          &nbsp;
          <Typography onClick={() => setSubmittingRequest(false)} color="secondary" component={"a"} variant="overline">Request Code</Typography>
        </Typography>
      }
    </form>
  )
}


export default ForgotPassword;