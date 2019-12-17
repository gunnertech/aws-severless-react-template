/* eslint-disable */

import React, { useState, useEffect } from 'react';
import SignUp from "./SignUp"
import SignIn from "./SignIn"
import ForgotPassword from "./ForgotPassword"
import ConfirmSignUp from "./ConfirmSignUp"
import Snackbar from "./Components/Snackbar"

import queryString from 'query-string'
import RequireNewPassword from './RequireNewPassword';

const STATES = [
  [ "Alabama", "AL" ], 
  [ "Alaska", "AK" ], 
  [ "Arizona", "AZ" ], 
  [ "Arkansas", "AR" ], 
  [ "California", "CA" ], 
  [ "Colorado", "CO" ], 
  [ "Connecticut", "CT" ], 
  [ "Delaware", "DE" ], 
  [ "District Of Columbia", "DC" ], 
  [ "Florida", "FL" ], 
  [ "Georgia", "GA" ], 
  [ "Hawaii", "HI" ], 
  [ "Idaho", "ID" ], 
  [ "Illinois", "IL" ], 
  [ "Indiana", "IN" ], 
  [ "Iowa", "IA" ], 
  [ "Kansas", "KS" ], 
  [ "Kentucky", "KY" ], 
  [ "Louisiana", "LA" ], 
  [ "Maine", "ME" ], 
  [ "Maryland", "MD" ], 
  [ "Massachusetts", "MA" ], 
  [ "Michigan", "MI" ], 
  [ "Minnesota", "MN" ], 
  [ "Mississippi", "MS" ], 
  [ "Missouri", "MO" ], 
  [ "Montana", "MT" ], 
  [ "Nebraska", "NE" ], 
  [ "Nevada", "NV" ], 
  [ "New Hampshire", "NH" ], 
  [ "New Jersey", "NJ" ], 
  [ "New Mexico", "NM" ], 
  [ "New York", "NY" ], 
  [ "North Carolina", "NC" ], 
  [ "North Dakota", "ND" ], 
  [ "Ohio", "OH" ], 
  [ "Oklahoma", "OK" ], 
  [ "Oregon", "OR" ], 
  [ "Pennsylvania", "PA" ], 
  [ "Rhode Island", "RI" ], 
  [ "South Carolina", "SC" ], 
  [ "South Dakota", "SD" ], 
  [ "Tennessee", "TN" ], 
  [ "Texas", "TX" ], 
  [ "Utah", "UT" ], 
  [ "Vermont", "VT" ], 
  [ "Virginia", "VA" ], 
  [ "Washington", "WA" ], 
  [ "West Virginia", "WV" ], 
  [ "Wisconsin", "WI" ], 
  [ "Wyoming", "WY" ]
]

const Complete = ({onComplete}) => {
  useEffect(() => {
    onComplete && onComplete()
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
    "phone_number": {
      label: "Mobile Phone",
      required: false,
      type: 'phone',
      initialValue: "",
      validations: {
        "Valid phone number": /^\+\d[\d ][\d ]\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      }
    },
    // "family_name": {
    //   label: "Last Name",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "given_name": {
    //   label: "First Name",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "address": {
    //   label: "Address",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "birthdate": {
    //   label: "Birthdate",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "custom:address2": {
    //   label: "Address 2",
    //   required: false,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {}
    // },
    // "custom:city": {
    //   label: "City",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "custom:zip": {
    //   label: "Zip",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Must be a valid zip code": /^\d{5}$|^\d{5}-\d{4}$/
    //   }
    // },
    // "custom:state": {
    //   label: "State",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {},
    //   options: STATES.map(([label, value]) => ({label, value}))
    // },
      
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
            order={['username', 'password', 'phone_number']}
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
            order={['username', 'password']}
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