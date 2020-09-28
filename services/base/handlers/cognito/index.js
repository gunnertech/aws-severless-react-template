import { cognito } from "handlers/clients";
import awsmobile from "aws-exports";
import { getByEmail as getUserByEmail } from "handlers/user";

const getCognitoRecord = username =>
  cognito
    .listUsers({
      UserPoolId: awsmobile.aws_user_pools_id,
      AttributesToGet: null,
      Limit: 1,
      Filter: `username = "${username}"`
    })
    .promise()
    .then(({Users}) => Users[0])
    

const getUserRecord = username =>
  getCognitoRecord(username)
    .then(User => User?.Attributes?.find?.(att => att.Name === 'email')?.Value)
    .then(getUserByEmail)


export {
  getUserRecord,
  getCognitoRecord
}