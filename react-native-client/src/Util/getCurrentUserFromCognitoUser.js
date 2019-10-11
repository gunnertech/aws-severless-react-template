

const getCurrentUserFromCognitoUser = (apolloClient, cognitoUser) =>
  Promise.resolve(cognitoUser)


export default getCurrentUserFromCognitoUser;