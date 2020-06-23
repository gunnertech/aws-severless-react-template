import React from 'react'
import { Auth } from 'aws-amplify';
import { Input, Button, Text } from 'react-native-elements';
import { useState } from 'react';
import { useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Picker } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { I18n } from 'aws-amplify';
// import { Button as RNButton } from 'react-native'
import { useRef } from 'react';
import { Linking } from 'expo';

import { normalizePhoneNumber } from "gunner-react"
import { STATES } from "react-shared/Config"
import useAnalyticsPageHit from 'Hooks/useAnalyticsPageHit';


const passwordIsValid = password => 
  [
    /[!@#$%^&*(),.?":{}|<>]/,
    /[a-z]/,
    /[A-Z]/,
    /\d/,
    /^.{8,25}$/
  ].every(regex => regex.test(password))

const emailIsValid = email => 
  [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    /^.{8,25}$/
  ].every(regex => regex.test(email))

const firstNameIsValid = value => 
  [
    /^\w/,
    /^.{1,25}$/
  ].every(regex => regex.test(value))

const lastNameIsValid = value => 
  [
    /^\w/,
    /^.{1,25}$/
  ].every(regex => regex.test(value))

const addressIsValid = value => 
  [
    /^\w/,
    /^.{8,256}$/
  ].every(regex => regex.test(value))

const cityIsValid = value => 
  [
    /^\w/,
    /^.{4,256}$/
  ].every(regex => regex.test(value))

const stateIsValid = value => 
  [
    /^\w/,
  ].every(regex => regex.test(value))

const zipIsValid = value => 
  [
    /^\d{5}$|^\d{5}-\d{4}$/
  ].every(regex => regex.test(value))

const birthdateIsValid = value => 
  [
    /^\d{2}\/\d{2}\/\d{4}$/
  ].every(regex => regex.test(value))

const phoneIsValid = phone => 
  !!normalizePhoneNumber(phone)

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
  const phoneInput = useRef(null);
  const firstNameInput = useRef(null);
  const lastNameInput = useRef(null);
  const addressInput = useRef(null);
  const address2Input = useRef(null);
  const cityInput = useRef(null);
  const stateInput = useRef(null);
  const zipInput = useRef(null);
  const birthdateInput = useRef(null);

  const [step, setStep] = useState(0);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(null);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [address, setAddress] = useState(null);
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zip, setZip] = useState(null);
  const [birthdate, setBirthdate] = useState(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const [doSubmit, setDoSubmit] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  
  
  const isValid = [
    passwordIsValid(password),
    emailIsValid(email),
    phoneIsValid(phone),
    firstNameIsValid(firstName),
    lastNameIsValid(lastName),
    addressIsValid(address),
    cityIsValid(city),
    stateIsValid(state),
    zipIsValid(zip),
    birthdateIsValid(birthdate)
  ].every(result => !!result)

  useAnalyticsPageHit("SignUp");

  

  useEffect(() => {
    !!doSubmit &&
    Auth.signUp({
      username: email,
      password,
      attributes: {
        given_name: firstName,
        family_name: lastName,
        address,
        'custom:mobile': phone,
        'custom:address2': address2,
        'custom:city': city,
        'custom:state': state,
        'custom:zip': zip,
        birthdate
      }
    })
    .then(data => [
      setDoSubmit(false),
      navigation.navigate("ConfirmSignUp", {email})
    ])
    .catch(err => [
      console.log(err),
      setDoSubmit(false),
      err.code === "InvalidParameterException" && !/Username/.test(err.message) && setPasswordError({err, name: "InvalidPassword"}),
      err.code === "InvalidParameterException" && /Username/.test(err.message) && setEmailError({err, name: "InvalidUsername"}),
      err.code === "UsernameExistsException" && setEmailError(err),
    ])
  }, [doSubmit, email, password])

  useEffect(() => {
    setEmailError(null);
  }, [email])

  useEffect(() => {
    setPasswordError(null);
  }, [password])

  useEffect(() => {
    navigation.setOptions({ 
      headerBackTitleVisible: false,
      // headerRight: ({tintColor}) =>
      //   <RNButton
      //     title="Forgot Password"
      //     onPress={() => navigation.navigate("Register")}
      //   />
    })
  }, [navigation])


  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView behavior="padding" enabled>
        <Input 
          ref={emailInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          autoFocus
          keyboardType="email-address"
          placeholder="Email Address"
          onChangeText={text => setEmail(text.toLowerCase())}
          value={email}
          textContentType="emailAddress"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={
            !!emailError ? I18n.get(emailError.name) : (
              !!email && !emailInput.current.isFocused() && !emailIsValid(email) ? "Please enter a valid email address" : null
            )
          }
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => phoneInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        <Input 
          ref={phoneInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          keyboardType="phone-pad"
          placeholder="Mobile Number"
          onChangeText={text => setPhone(text.toLowerCase().replace(/\D/g, ""))}
          value={phone}
          textContentType="telephoneNumber"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={!!phone && !phoneInput.current.isFocused() && !phoneIsValid(phone) ? "Please enter a valid phone number" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => firstNameInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        <Input 
          ref={firstNameInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          placeholder="First Name"
          onChangeText={text => setFirstName(text)}
          value={firstName ?? ""}
          textContentType="givenName"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={firstName !== null && !firstNameInput.current.isFocused() && !firstNameIsValid(firstName) ? "Please enter a valid first name" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => lastNameInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        <Input 
          ref={lastNameInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          placeholder="Last Name"
          onChangeText={text => setLastName(text)}
          value={lastName ?? ""}
          textContentType="familyName"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={lastName !== null && !lastNameInput.current.isFocused() && !lastNameIsValid(phone) ? "Please enter a valid last name" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => addressInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        <Input 
          ref={addressInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          placeholder="Address"
          onChangeText={text => setAddress(text)}
          value={address ?? ""}
          textContentType="streetAddressLine1"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={address !== null && !addressInput.current.isFocused() && !addressIsValid(phone) ? "Please enter a valid address" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => address2Input.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        <Input 
          ref={address2Input}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          placeholder="Address 2"
          onChangeText={text => setAddress2(text)}
          value={address2 ?? ""}
          textContentType="streetAddressLine2"
          placeholderTextColor={theme.colors.textMuted}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => cityInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        <Input 
          ref={cityInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          placeholder="City"
          onChangeText={text => setCity(text)}
          value={city ?? ""}
          textContentType="addressCity"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={city !== null && !cityInput.current.isFocused() && !cityIsValid(city) ? "Please enter a valid city" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => stateInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        <View style={{marginBottom: 16, marginTop: 16}}>

        <Input 
          ref={stateInput}
          placeholder="State"
          // onChangeText={text => setState(text)}
          value={state ?? ""}
          textContentType="addressState"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={state !== null && !stateInput.current.isFocused() && !stateIsValid(state) ? "Please enter a valid state" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => zipInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
          onFocus={() => [setShowPicker(true), stateInput.current.blur()]}
        />

        {
          !!showPicker &&
          <View style={{
            alignItems: "center",
            backgroundColor: "black",
            marginTop: -40,
            // height: 100, 
            width: "100%"
          }}>
              <Picker
                prompt="Select State"
                itemStyle={{color: "white"}}
                selectedValue={state}
                style={{ width: "100%"}}
                onValueChange={(itemValue, itemIndex) => [setState(itemValue), setShowPicker(false)]}
              >
                {
                  STATES.map(([name, abbrev]) => 
                    <Picker.Item key={abbrev} label={name} value={abbrev} />
                  )
                }
              </Picker>
            </View>
        }
        </View>

        
        <Input 
          ref={zipInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          placeholder="Zip Code"
          onChangeText={text => setZip(text)}
          value={zip ?? ""}
          textContentType="sublocality"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={zip !== null && !zipInput.current.isFocused() && !zipIsValid(zip) ? "Please enter a valid zip code" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => birthdateInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />
        
        

        

        <Input 
          ref={birthdateInput}
          containerStyle={{marginBottom: 16, marginTop: 16}}
          placeholder="Birthdate (MM/DD/YY)"
          onChangeText={text => setBirthdate(text)}
          value={birthdate ?? ""}
          textContentType="none"
          placeholderTextColor={theme.colors.textMuted}
          errorMessage={birthdate !== null && !birthdateInput.current.isFocused() && !birthdateIsValid(birthdate) ? "Please enter a valid birthdate (MM/DD/YYYY)" : null}
          enablesReturnKeyAutomatically
          returnKeyType="next"
          onSubmitEditing={() => passwordInput.current.focus() }
          onBlur={() => setStep(step => step + 1)}
        />

        {/* {console.log(phoneInput.current)} */}

        <Input 
          ref={passwordInput}
          containerStyle={{marginBottom: 16}}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          value={password}
          textContentType="password"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={true}
          enablesReturnKeyAutomatically
          returnKeyType="done"
          onSubmitEditing={() => setDoSubmit(true) }
          errorMessage={!!passwordError ? I18n.get(passwordError.name) : (
            !passwordIsValid(password) ? "Valid passwords must be at least 8 characters long with at least one of eacch of the following: lowercase letter, uppercase letter, number and special character (!^%#%)" : null
          )}
        />

        <Button
          disabled={!isValid}
          loading={!!doSubmit}
          title="Register"
          onPress={() => setDoSubmit(true)}
          containerStyle={{marginBottom: 16, marginHorizontal: 8}}
        />

        <View style={{flexDirection: "row", flex: 1, marginHorizontal: 16}}>
          <Text>By clicking "Register," you are agreeing to our <Text onPress={() => Linking.openURL("https://propswap.com/pages/terms")} style={{color: theme.colors.primary}}>Privacy Policy</Text> and <Text onPress={() => Linking.openURL("https://propswap.com/pages/terms")} style={{color: theme.colors.primary}}>Terms of Use</Text>.</Text>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}