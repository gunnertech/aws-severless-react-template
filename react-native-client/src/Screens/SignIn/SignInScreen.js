import React, { useEffect, useContext } from 'react';
import { SignUp, SignIn, ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';
import theme from '../../Styles/combinedTheme'
import { CurrentUserContext } from '../../Contexts/CurrentUser';
import Icon from 'react-native-vector-icons/FontAwesome';

const AuthComponent = () => null

const AuthComponentWithAuth = withAuthenticator(AuthComponent, false, [
  <SignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <SignUp
    signUpConfig={{
      hideAllDefaults: true,
      signUpFields: [
        {
          key: 'username',
          type: 'email',
          required: true,
          label: 'Email',
          displayOrder: 2,
          placeholder: "Enter your email (used to sign in)"
        },
        {
          key: 'name',
          type: 'text',
          required: true,
          label: 'Name',
          displayOrder: 1,
          placeholder: "Enter the name you want others to see"
        },
        {
          key: 'password',
          type: 'password',
          required: true,
          label: 'Password',
          displayOrder: 3,
          placeholder: "Enter your password"
        }
      ]
    }}
  />,
  <ConfirmSignUp/>,
  <ForgotPassword/>,
  <RequireNewPassword />
], false, theme.amplify);

const SignInScreen = ({navigation}) => {
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    !!currentUser && 
    navigation.navigate("Home")
  }, [!!currentUser]);

  return !!currentUser ? null : (
    <AuthComponentWithAuth />
  )
}

SignInScreen.navigationOptions = {
  drawerLabel: "Sign In",
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="sign-in"
      color={tintColor}
      size={16}
    />
  ),
}

export default SignInScreen