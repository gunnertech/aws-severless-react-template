import Auth from '@aws-amplify/auth';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

import awsmobile from '../aws-exports';


const cognitoClient = () =>
  Auth.currentCredentials()
    .then(credentials =>
      Promise.resolve(
        new CognitoIdentityServiceProvider({
          apiVersion: '2016-04-18',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
      )
    )

const getUsername = (field, value) =>
  cognitoClient()
    .then(client =>
      client.listUsers({
        UserPoolId: awsmobile.aws_user_pools_id,
        AttributesToGet: null,
        Limit: 1,
        Filter: `${field} = "${value}"`
      })
      .promise()
    )
    .then(({Users}) =>
      !!Users.length ? Users[0].Username : false
    )
  
const checkIfEmailIsAvailable = email =>
  cognitoClient()
    .then(client =>
      client.listUsers({
        UserPoolId: awsmobile.aws_user_pools_id,
        AttributesToGet: null,
        Limit: 1,
        Filter: `email = "${email}"`
      })
      .promise()
    )
    .then(({Users}) =>
      !Users.length
    )

const checkIfPhoneNumberIsAvailable = phone_number =>
  cognitoClient()
    .then(client =>
      client.listUsers({
        UserPoolId: awsmobile.aws_user_pools_id,
        AttributesToGet: null,
        Limit: 1,
        Filter: `phone_number = "+${phone_number.replace(/\D+/g,"")}"`
      })
      .promise()
    )
    .then(({Users}) =>
      !Users.length
    )

export { getUsername, checkIfEmailIsAvailable, checkIfPhoneNumberIsAvailable }