import React from 'react'
import { Auth } from 'aws-amplify';
import { Input, Button, Text } from 'react-native-elements';
import { useState } from 'react';
import { useEffect } from 'react';
import { SafeAreaView, SafeAreaConsumer } from 'react-native-safe-area-context'
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { I18n } from 'aws-amplify';
import { Button as RNButton } from 'react-native'
import { useRef } from 'react';
import useAnalyticsPageHit from 'Hooks/useAnalyticsPageHit';

const authScreenLabels = {
  en: {
    "UserNotFoundException": "Your email address or code was incorrect. Please try again",
    "InvalidParameterException": "That user has already been confirmed. If you forgot your password, please return to sign in and request a reset."
  }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

export default ({navigation, route: {params}}) => {
  const theme = useTheme();
  const emailInput = useRef(null);
  const [email, setEmail] = useState("");
  const [doSubmit, setDoSubmit] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const isValid = !!email;

  useAnalyticsPageHit("RequestCode");

  useEffect(() => {
    !!doSubmit &&
    Auth.resendSignUp(email)
      .then(data => [
        setDoSubmit(false),
        navigation.navigate("ConfirmSignUp", {email})
      ])
      .catch(e => [
        setDoSubmit(false),
        setEmailError(e),
        console.log(e)
      ])
  }, [doSubmit, email])

  useEffect(() => {
    setEmailError(null)
  }, [email])


  return (
    <>
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
        returnKeyType="done"
        // onKeyPress={({ nativeEvent: { key: keyValue } }) => console.log(keyValue)}
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