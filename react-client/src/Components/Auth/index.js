import React, { useState, useEffect } from 'react';
import SignUp from "./SignUp"
import SignIn from "./SignIn"
import ForgotPassword from "./ForgotPassword"
import ConfirmSignUp from "./ConfirmSignUp"
import Snackbar from "./Components/Snackbar"


// import queryString from 'query-string'
import RequireNewPassword from './RequireNewPassword';

import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from "./Components/Tabs";

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(-2),
    padding: theme.spacing(2),
    textAlign: "center",
    '& p': {
      marginTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderBottom: `2px solid ${theme.palette.background.default}`
    }
  },
}));

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
  history,
  location,
  initialAuthState = "signup", 
  usernameField = "email",
  initialUsernameValue = "",
  initialPasswordValue = "",
  customFields = {
    "custom:mobile": {
      label: "Mobile Phone",
      required: true,
      type: 'phone',
      initialValue: "",
      validations: {
        "Valid phone number": /^\+\d\d?\d? \(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      }
    },
    "family_name": {
      label: "Last Name",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {
        "Can't be blank": /^.+$/
      }
    },
    "given_name": {
      label: "First Name",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {
        "Can't be blank": /^.+$/
      }
    },
    "address": {
      label: "Address",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {
        "Can't be blank": /^.+$/
      }
    },
    "birthdate": {
      label: "Birthdate",
      required: true,
      type: 'date',
      initialValue: "",
      validations: {
        "Must be a valid date": /^\d\d\/\d\d\/\d\d\d\d$/
      }
    },
    "custom:address2": {
      label: "Address 2",
      required: false,
      type: 'text',
      initialValue: "",
      validations: {}
    },
    "custom:city": {
      label: "City",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {
        "Can't be blank": /^.+$/
      }
    },
    "custom:zip": {
      label: "Zip",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {
        "Must be a valid zip code": /^\d{5}$|^\d{5}-\d{4}$/
      }
    },
    "custom:state": {
      label: "State",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {},
      options: STATES.map(([label, value]) => ({label, value}))
    },
      
  }
}) => {
  const routeAuthState = (location.pathname||"").replace(/\W/g, "");
  const [authState, setAuthState] = useState(['signin','signup'].includes(routeAuthState) ? routeAuthState : 'signin')//useState(queryString.parse(location.search).authState || initialAuthState);
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

  const classes = useStyles();

  return (
    <>
      <Grid container spacing={0} justify={"center"}>
        <Grid item xs={12} md={6}>
          <Tabs history={history} currentPath={location.pathname} onChange={path => [
            setAuthState((path||"").replace(/\W/g, ""),
            history.push(path),
            )
          ]} />
          <div className={classes.content}>
            {
              !!message &&
              !!message.message &&
              <Snackbar 
                message={message.message} 
                type={message.type || 'info'} 
                forceOpen={!!message.message} 
              />
            }
            <img src={require("../../assets/css/logo-alt.png")} alt="logo" />
            <Typography paragraph>Log In or Register to Buy or Sell tickets on PropSwap.</Typography>
            <Button variant="text" color="secondary" onClick={() => setAuthState('forgotpassword')}>If you had an old PropSwap account, click here to get a new password which is required to login</Button>
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
                  order={['username', 'password', 'custom:mobile', 'given_name', 'family_name', 'address', 'custom:address2', 'custom:city', 'custom:state', "custom:zip", "birthdate"]}
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
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Auth