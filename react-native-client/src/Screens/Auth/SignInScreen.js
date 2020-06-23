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
import DrawerButton from '../../Navigators/DrawerButton';
import useAnalyticsPageHit from 'Hooks/useAnalyticsPageHit';

const authScreenLabels = {
  en: {
    "UserNotFoundException": "Your email address or password was incorrect. Please try again.",
    "NotAuthorizedException": "Your email address or password was incorrect. Please try again.",
    "PasswordResetRequiredException": "Your password must be reset. Please tap 'Forgot Password?' below."
  }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

export default ({navigation, route: {params}}) => {
  const theme = useTheme();
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doSubmit, setDoSubmit] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const isValid = !!password && !!email;

  useAnalyticsPageHit("SignIn");

  useEffect(() => {
    setEmail(params?.email)
  }, [params])

  useEffect(() => {
    !!doSubmit &&
    Auth.signIn(email, password)
      .then(user => (
        user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA' ? (
          console.log("TODO")
        ) : user.challengeName === 'NEW_PASSWORD_REQUIRED' ? (
          Promise.reject({name: "NEW_PASSWORD_REQUIRED", message: "You must choose a new password.", code: "NEW_PASSWORD_REQUIRED", data: {email}})
        ) : user.challengeName === 'MFA_SETUP' ? (
          console.log("TODO")
        ) : user.challengeName === 'CUSTOM_CHALLENGE' ? (
          console.log("TODO")
        ) : (
          user
        )
      ))
      .then(user => !user ? null :
        Auth.verifiedContact(user)
      )
      .then(data => !data ? null :
        !!Object.keys(data.verified).length ? ( // IF THE USER HAS AT LEAST ONE METHOD OF CONTACT VERIFIED
          navigation.navigate("Home")
        ) : (
          navigation.navigate("VerifyContact", {email})
        )
      )
      .catch(error => console.log("ERROR", error) || error.name === 'NEW_PASSWORD_REQUIRED' ? (
        [setDoSubmit(false), /*navigation.navigate("NewPasswordRequired", {email: error.data.email})*/]
      ) : (
        [setDoSubmit(false), setEmailError(error)]
      ))
  }, [doSubmit, email, password])

  useEffect(() => {
    setEmailError(null)
  }, [email])

  useEffect(() => {
    navigation.setOptions({ 
      // headerRight: ({tintColor}) =>
      //   <RNButton
      //     color={tintColor}
      //     title="Register"
      //     onPress={() => navigation.navigate("SignUp")}
      //   />
      // ,
      // headerLeft: ({tintColor}) => <DrawerButton navigation={navigation} color={tintColor ?? (theme.dark ? 'white' : theme.colors.primary)} />
    })
  }, [navigation])


  return (
    <>
      <Input 
        ref={emailInput}
        containerStyle={{marginBottom: 16, marginTop: 16}}
        autoFocus={!params?.email}
        keyboardType="email-address"
        placeholder="Email Address"
        onChangeText={text => setEmail(text.toLowerCase())}
        value={email}
        textContentType="emailAddress"
        placeholderTextColor={theme.colors.textMuted}
        errorMessage={!!emailError ? I18n.get(emailError.name) : null}
        enablesReturnKeyAutomatically
        returnKeyType="next"
        // onKeyPress={({ nativeEvent: { key: keyValue } }) => console.log(keyValue)}
        onSubmitEditing={() => passwordInput.current.focus() }
      />

      <Input 
        ref={passwordInput}
        containerStyle={{marginBottom: 16}}
        placeholder="Password"
        autoFocus={!!params?.email}
        onChangeText={text => setPassword(text)}
        value={password}
        textContentType="password"
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={true}
        enablesReturnKeyAutomatically
        returnKeyType="done"
        onSubmitEditing={() => setDoSubmit(true) }
        errorMessage={!!params?.email ? "Account created! Please sign in with the password you selected" : undefined}
      />

      <Button
        disabled={!isValid}
        loading={!!doSubmit}
        title="Sign In"
        onPress={() => setDoSubmit(true)}
        containerStyle={{marginBottom: 16, marginHorizontal: 8}}
      />

      <View style={{flexDirection: "row"}}>
        <Button onPress={() => navigation.navigate("ForgotPassword")} type="clear" title="Forgot Password?" containerStyle={{flex: 1}} titleProps={{style: {textAlign: 'left', color: theme.colors.primary}}} titleStyle={{textAlign: "left"}} />
        <Button onPress={() => navigation.navigate("RequestCode")} type="clear" title="Confirm Code" containerStyle={{flex: 1}} titleProps={{style: {textAlign: 'right', color: theme.colors.primary}}} titleStyle={{textAlign: "right"}} />
      </View>

        <Button onPress={() => navigation.navigate("SignUp")} type="clear" title="No Account? Sign Up!" containerStyle={{flex: 1, marginVertical: 16}} titleProps={{style: {textAlign: 'left', color: theme.colors.primary}}} titleStyle={{textAlign: "left"}} />
      
    </>
  )
}