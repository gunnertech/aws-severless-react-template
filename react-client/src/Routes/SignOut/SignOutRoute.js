import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { Redirect } from 'react-router'

const SignOutRoute = () => {
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    Auth.signOut()
      .then(() => setSignedOut(true))
  }, [])

  return (
    !!signedOut ? (
      <Redirect to="/" />
    ) : (
      null
    )
  )
}

export default SignOutRoute;