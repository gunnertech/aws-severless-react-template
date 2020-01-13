/* eslint-disable */

import { useState, useEffect } from "react";
// import { useQuery, useMutation } from '@apollo/react-hooks'

/* Custom imports go here*/
// import User from "../api/User"

/* Custom imports end here */

const useCurrentUser = cognitoUser => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const {loading, data: {getUser: user} = {}} = {loading: false, data: {getUser: null}};
  const [_updateUser, updateUser] = [() => Promise.resolve(true), null];
  const [_createUser, createUser] = [() => Promise.resolve(true), true];
  const refetch = () => null;
  const user = null;

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

  // !!error && console.log(error);


  useEffect(() => {
    !cognitoUser ? (
      setCurrentUser(null)
    ) : !loading && !user ? (
      _createUser()
    ) : !loading && !!user ? (
      _updateUser()
    ) : (
      console.log(null)
    )
  }, [cognitoUser, users?.length, loading]);

  useEffect(() => {
    !!refetch &&
    !!lastUpdatedAt &&
    refetch()
  }, [lastUpdatedAt])

  useEffect(() => {
    !!lastUpdatedAt &&
    (user?.updatedAt > lastUpdatedAt || !currentUser) &&
    !!cognitoUser && 
    setCurrentUser({...user, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})
  }, [user?.updatedAt, lastUpdatedAt, !!cognitoUser, !!currentUser])

  useEffect(() => {
    !!createUser &&
    !!cognitoUser &&
    setLastUpdatedAt(createUser.updatedAt)
    // setCurrentUser({...createUser, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})
  }, [!!createUser, !!cognitoUser])

  useEffect(() => {
    !!updateUser &&
    !!cognitoUser &&
    setLastUpdatedAt(updateUser.updatedAt)
    // setCurrentUser({...updateUser, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})
  }, [!!updateUser, !!cognitoUser])

  return currentUser;
}


export default useCurrentUser;