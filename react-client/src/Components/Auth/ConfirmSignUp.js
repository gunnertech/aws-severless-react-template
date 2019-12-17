/* eslint-disable */
import React, { useState, useEffect } from 'react';

import Auth from '@aws-amplify/auth';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import { CodeField, UsernameField } from "./Fields"


  

const ConfirmSignUp = ({
  onValueChange,
  onAuthStateChange,
  usernameField = "email",
  initialUsernameValue
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [resend, setResend] = useState(false);
  const [usernameValue, setUsernameValue] = useState(initialUsernameValue);
  const [usernameValid, setUsernameValid] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [codeErrorMessage, setCodeErrorMessage] = useState("");

  useEffect(() => {
    onValueChange('code', codeValue)
  }, [codeValue]);


  useEffect(() => {
    setIsValid(!!codeValid && !!usernameValid);
  }, [codeValid]);

  useEffect(() => {
    !!resend && Promise.all([
      () => setLoading(true),
      Auth.resendSignUp(usernameValue)
        .then(data => console.log(data) || [
          setLoading(false),
          setResend(false),
          setCodeErrorMessage("Code resent. Please check your device.")
        ])
        .catch(e => console.log(e) || [
          setUserErrorMessage(e.message ? e.message : e.replace(/username/i, "")),
          setLoading(false),
          setResend(false)
        ])
    ])
  }, [resend])

  useEffect(() => {
    !!submitting && Promise.all([
      () => setLoading(true),
      Auth.confirmSignUp(usernameValue, codeValue)
        .then(data => console.log(data) || [
          setLoading(false),
          setSubmitting(false),
          onAuthStateChange('signin', {type: 'success', message: "Please sign in with your new account details"})
        ])
        .catch(e => console.log(e) || [
          e.code === 'CodeMismatchException' ? (
            setCodeErrorMessage(e.message)
          ) : (
            setUserErrorMessage(e.message)
          ),
          setLoading(false),
          setSubmitting(false)
        ])
    ])
  }, [submitting])

  return (
    <form noValidate autoComplete="off">
      <UsernameField 
        disabled={!!initialUsernameValue}
        value={usernameValue} 
        usernameField={usernameField} 
        onValueChange={setUsernameValue}
        onValidChange={setUsernameValid}
        showValidators={false}
        error={userErrorMessage}
      />

      <CodeField 
        value={codeValue} 
        onValueChange={setCodeValue}
        onValidChange={setCodeValid}
        showValidators={false}
        helperText={"Enter the six digit code we just sent to your device."}
        error={codeErrorMessage}
      />
      
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        disabled={!isValid || !!loading} 
        size="large"
        onClick={() => setSubmitting(true)}
      >
        Confirm
      </Button>
      <Typography align="center" variant="overline">
        Lost your code?
        &nbsp;
        <Typography onClick={() => setResend(true)} color="secondary" component={"a"} variant="overline">Resend</Typography>
      </Typography>
    </form>
  )
}


export default ConfirmSignUp;