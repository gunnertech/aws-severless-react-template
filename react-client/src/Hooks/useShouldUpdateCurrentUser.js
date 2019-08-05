import { useState, useEffect } from 'react';

//BEGIN CUSTOM IMPORTS
// import { useSubscription } from 'react-apollo-hooks';
// import gql from 'graphql-tag'
// import { onUpdateUserById } from '../graphql/subscriptions'
//END CUSTOM IMPORTS


const useShouldUpdateCurrentUser = currentUser => {
  const [shouldUpdateCurrentUser, setShouldUpdateCurrentUser] = useState(false);
  
  // //BEGIN CUSTOM LOGIC
  // const { data: { onUpdateUser: user } = {} } = useSubscription(gql(onUpdateUserById), {
  //   variables: {
  //     id: currentUser.id
  //   }
  // });

  // console.log("SUBSCRIPTION", user);
  
  // useEffect(() => { //WHENEVER THE USER IS UPDATED, TELL THE APP TO REFRESH THE CURRENT USER OBJECT
  //   setShouldUpdateCurrentUser(true)
  // }, [JSON.stringify(user)]);
  // // END CUSTOM LOGIC

  return shouldUpdateCurrentUser;
}

export default useShouldUpdateCurrentUser;