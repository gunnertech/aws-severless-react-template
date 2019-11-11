import { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/react-hooks'

/* Custom imports go here*/


/* Custom imports end here */

const userCurrentUser = cognitoUser => {
  const [currentUser, setCurrentUser] = useState(undefined);

  const {loading, data: {getUser: user}} = {loading: false, data: {getUser: null}};
  const _updateUser = () => Promise.resolve({data: {updateUser: {}}});
  const _createUser = () => Promise.resolve({data: {createUser: {}}});

  // const {loading, data: {getUser: user}} = useQuery(User.queries.get, {variables: {id: ((cognitoUser||{}).username || '<>')}});
  
  // const _createUser = useMutation(User.mutations.create, {
  //   variables: {input: {
  //     id: ((cognitoUser||{}).username || '<>'),
  //     name: !!cognitoUser ? cognitoUser.attributes.name : "none"
  //   }}
  // });

  // const _updateUser = useMutation(User.mutations.update, {
  //   variables: {input: {
  //     id: ((cognitoUser||{}).username || '<>'),
  //   }}
  // });

  useEffect(() => {
    !cognitoUser ? (
      setCurrentUser(null)
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
  }, [cognitoUser, !!user]);

  return currentUser;
}


export default userCurrentUser;