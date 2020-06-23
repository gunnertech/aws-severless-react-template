import React from 'react'
import { Auth } from 'aws-amplify';
import { Input, Button } from 'react-native-elements';
import { useState } from 'react';
import { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { I18n } from 'aws-amplify';
import { useRef } from 'react';
import useAnalyticsPageHit from 'Hooks/useAnalyticsPageHit';

const authScreenLabels = {
  en: {
    "UserNotFoundException": "Your email address or code was incorrect. Please try again",
    "CodeMismatchException": "Invalid verification code provided, please try again."
  }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

export default ({navigation, route: {params}}) => {
  const theme = useTheme();
  const emailInput = useRef(null);
  const codeInput = useRef(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [doSubmit, setDoSubmit] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const isValid = !!code && !!email;

  useAnalyticsPageHit("ConfirmSignUp");

  useEffect(() => {
    setEmail(params.email)
  }, [params])

  useEffect(() => {
    !!doSubmit &&
    Auth.confirmSignUp(email, code)
      .then(data => [
        setDoSubmit(false),
        navigation.navigate("SignIn", {email})
      ])
      .catch(e => [
        setDoSubmit(false),
        setEmailError(e),
        console.log(e)
      ])
  }, [doSubmit, email, code])

  useEffect(() => {
    setEmailError(null)
  }, [email])

  // useEffect(() => {
  //   navigation.setOptions({ 
  //     headerRight: ({tintColor}) =>
  //       <RNButton
  //         title="Register"
  //         onPress={() => navigation.navigate("SignUp")}
  //       />
  //   })
  // }, [navigation])

  return (
    <>
      {
        !params.email &&
        <Input 
          ref={emailInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          autoFocus
          keyboardType="email-address"
          placeholder="Enter your Email Address"
          onChangeText={text => setEmail(text.toLowerCase())}
          value={email}
          textContentType="emailAddress"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={!!emailError ? I18n.get(emailError.name) : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          // onKeyPress={({ nativeEvent: { key: keyValue } }) => console.log(keyValue)}
          onSubmitEditing={() => codeInput.current.focus() }
        />
      }
      <Input 
        ref={codeInput}
        containerStyle={{marginBottom: 16}}
        placeholder="Enter your Code"
        errorMessage={!!emailError ? I18n.get(emailError.name) : `Enter the code that was emailed to ${params.email}`}
        onChangeText={text => setCode(text)}
        value={code}
        textContentType="oneTimeCode"
        keyboardType="number-pad"
        placeholderTextColor={theme.colors.textMuted}
        enablesReturnKeyAutomatically
        returnKeyType="done"
        onSubmitEditing={() => setDoSubmit(true) }
      />

      <Button
        disabled={!isValid}
        loading={!!doSubmit}
        title="Confirm Account"
        onPress={() => setDoSubmit(true)}
        containerStyle={{marginBottom: 16}}
      />
    </>
  )
}