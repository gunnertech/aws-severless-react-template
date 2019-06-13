/// ADD LOGIC TO CREATE USERS, SEND INVITATIONS, ADD TO GROUPS, ETC WITH APPSYNC HERE. JUST REMEMBER TO RETURN A USER OBJECT

const getCurrentUserFromCognitoUser = (cognitoUser, {groupName}) =>
  Promise.resolve(cognitoUser)

export default getCurrentUserFromCognitoUser;