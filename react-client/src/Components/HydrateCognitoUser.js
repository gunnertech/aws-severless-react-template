import React from 'react'


/* Custom imports go here*/
import { useState, useEffect } from 'react';


import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag';
import { createUser, updateUser } from '../graphql/mutations';
import { getUser } from '../graphql/queries';
/* Custom imports end here */

const HydrateCognitoUser = ({cognitoUser, children}) => {
  
  /**** Base */
  //const currentUser = {...cognitoUser};

  /* Custom Logic goes here*/

  const [currentUser, setCurrentUser] = useState(undefined);
  const {loading, data: {getUser: user}} = useQuery(gql(getUser), {variables: {id: ((cognitoUser||{}).username || '<>')}});
  const _createUser = useMutation(gql(createUser), {
    variables: {input: {
      id: ((cognitoUser||{}).username || '<>'),
      email: !!cognitoUser ? cognitoUser.attributes.email : undefined,
      rating: 1,
      notifyViaEmailOnAll: true,
      notifyViaPushOnAll: true,
      notifyViaEmailOnLongshot: true,
      notifyViaPushOnLongshot: true,
      notifyViaEmailOnTeam: true,
      notifyViaPushOnTeam: true,
      notifyViaEmailOnSport: true,
      notifyViaPushOnSport: true,
      displayName: !!cognitoUser ? `${cognitoUser.attributes.email.split("@")[0]}${Math.floor(1000 + Math.random() * 9000)}` : undefined //Generate username with four random digits
    }}
  });
  const _updateUser = useMutation(gql(updateUser), {
    variables: {input: {
      id: ((cognitoUser||{}).username || '<>'),
    }}
  });


  useEffect(() => {
    !cognitoUser ? (
      setCurrentUser(cognitoUser)
    ) : cognitoUser.username === process.env.REACT_APP_guest_user_name || cognitoUser.attributes.email === process.env.REACT_APP_guest_user_name ? (
      setCurrentUser(null)
    ) : !loading && !user ? (
      _createUser()
        .then(({data: {createUser}}) =>
          setCurrentUser({...createUser, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})  
        )
    ) : !loading && !!user ? (
      _updateUser()
        .then(({data: {updateUser}}) =>
          setCurrentUser({...updateUser, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})  
        )
    ) : (
      console.log("nothing")
    )
  }, [cognitoUser, !!user])

  /* Custom Logic ends goes here*/

  return (
    children(currentUser)
  )
}

export default HydrateCognitoUser;