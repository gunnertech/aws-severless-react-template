import React from 'react'
import { Auth } from 'aws-amplify';
import { Input, Button, Text } from 'react-native-elements';
import { useState } from 'react';
import { useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { I18n } from 'aws-amplify';
import { Button as RNButton } from 'react-native'
import { useRef } from 'react';
import { Linking } from 'expo';
import useAnalyticsPageHit from 'Hooks/useAnalyticsPageHit';

const authScreenLabels = {
  en: {
    "InvalidPassword": "You entered an invalid password. Passwords must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit and one special character.",
    "InvalidUsername": "You must enter a valid email address.",
    "UsernameExistsException": "That email address has been taken. Please try a different one or go back and reset your password."
  }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

export default ({navigation}) => {
  const theme = useTheme();
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const codeInput = useRef(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [needCode, setNeedCode] = useState(false);
  const [password, setPassword] = useState("");
  const [doSubmit, setDoSubmit] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [codeError, setCodeError] = useState(null);

  const isValid = (!!needCode ? !!password && !!email && !!code : !!email);

  useAnalyticsPageHit("ForgotPassword");

  useEffect(() => {
    !!doSubmit &&
    !needCode &&
    !!isValid &&
    Auth.forgotPassword(email)
      .then(() => [setDoSubmit(false), setNeedCode(true)])
      .catch(e => [
        setDoSubmit(false),
        setEmailError(e),
        console.log(e)
      ])
  }, [doSubmit, email, needCode, isValid])

  useEffect(() => {
    !!doSubmit &&
    !!needCode &&
    !!isValid &&
    Auth.forgotPasswordSubmit(email, code, password)
      .then(() => [navigation.navigate("SignIn", {email}), setDoSubmit(false), setNeedCode(false)])
      .catch(e => [
        setDoSubmit(false),
        setEmailError(e),
        console.log(e)
      ])
  }, [doSubmit, email, needCode, password, code, isValid])

  useEffect(() => {
    setEmailError(null);
  }, [email])

  useEffect(() => {
    setPasswordError(null);
  }, [password])

  useEffect(() => {
    setCodeError(null);
  }, [code])

  useEffect(() => {
    navigation.setOptions({ 
      headerBackTitleVisible: false,
    })
  }, [navigation])


  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView behavior="padding" enabled>
        {
          !needCode &&
          <Input 
            ref={emailInput}
            containerStyle={{marginBottom: 16, marginTop: 16}}
            autoFocus={!needCode}
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

        {
          !!needCode &&
          <>
            <Input 
              ref={codeInput}
              containerStyle={{marginBottom: 16}}
              autoFocus={!!needCode}
              placeholder="Enter your Code"
              errorMessage={!!emailError ? I18n.get(emailError.name) : `Enter the code that was emailed to ${email}`}
              onChangeText={text => setCode(text)}
              value={code}
              textContentType="oneTimeCode"
              keyboardType="number-pad"
              placeholderTextColor={theme.colors.textMuted}
              enablesReturnKeyAutomatically
              returnKeyType="next"
              onSubmitEditing={() => passwordInput.current.focus() }
            />

            <Input 
              ref={passwordInput}
              containerStyle={{marginBottom: 16}}
              placeholder="Enter your Password"
              onChangeText={text => setPassword(text)}
              value={password}
              textContentType="password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={true}
              enablesReturnKeyAutomatically
              returnKeyType="done"
              onSubmitEditing={() => setDoSubmit(true) }
              errorMessage={!!passwordError ? I18n.get(passwordError.name) : null}
            />
          </>
        }

        <Button
          disabled={!isValid}
          loading={!!doSubmit}
          title={!needCode ? "Request Code" : "Save Password"}
          onPress={() => setDoSubmit(true)}
          containerStyle={{marginBottom: 16}}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  )
}