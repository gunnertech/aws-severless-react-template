import { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/react-hooks'

/* Custom imports go here*/
// import User from "../api/User"

/* Custom imports end here */

const useCurrentUser = cognitoUser => {
  const [currentUser, setCurrentUser] = useState(undefined);


  const {error, loading, data: {getUser: user} = {}} = {error: null, loading: false, data: {getUser: null}};
  const [_updateUser, updateUser] = [() => Promise.resolve(null), null];
  const [_createUser, createUser] = [() => Promise.resolve(null), null];

  // const {loading, error, data: {getUser: user} = {}} = useQuery(User.queries.get, {variables: {id: ((cognitoUser||{}).username || '<>')}});

  
  // const [_createUser, {data: {createUser} = {}}] = useMutation(User.mutations.create, {
  //   variables: {input: {
  //     id: ((cognitoUser||{}).username || '<>'),
  //     name: !!cognitoUser ? cognitoUser.attributes.name : "none",
  //     followersCount: 0,
  //     followsCount: 0,
  //   }}
  // });

  // const [_updateUser, {data: {updateUser} = {}}] = useMutation(User.mutations.update, {
  //   variables: {input: {
  //     id: ((cognitoUser||{}).username || '<>'),
  //   }}
  // });

  !!error && console.log(error);

  useEffect(() => {
    !cognitoUser ? (
      setCurrentUser(null)
    ) : !loading && !user ? (
      _createUser()
    ) : !loading && !!user ? (
      _updateUser()
    ) : (
      null
    )
  }, [cognitoUser, !!user, loading]);

  useEffect(() => {
    !!createUser &&
    setCurrentUser({...createUser, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})
  }, [!!createUser, !!cognitoUser])

  useEffect(() => {
    !!updateUser &&
    setCurrentUser({...updateUser, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})
  }, [!!updateUser, !!cognitoUser])

  return currentUser;
}


export default useCurrentUser;