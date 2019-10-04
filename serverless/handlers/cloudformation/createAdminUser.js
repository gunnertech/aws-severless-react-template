import awsmobile from '../../../amplify/src/aws-exports';

import { secrets, cognito } from "../clients"

import {
  getUserAttributes,
  sendResponse
} from "./index"


// eslint-disable-next-line import/prefer-default-export
export const js = (event, context) =>
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    secrets
      .getSecretValue({SecretId: 'AdminUserSecret'})
      .promise()
      .then(secret => Promise.resolve(JSON.parse(secret.SecretString)) )
      .then(({username, password, email, phone}) =>
        cognito
          .adminCreateUser({
            UserPoolId: awsmobile.aws_user_pools_id, /* required */
            Username: username, /* required */
            DesiredDeliveryMediums: !!phone ? [ "EMAIL", "PHONE"] : [ "EMAIL" ]  ,
            TemporaryPassword: password,
            UserAttributes: getUserAttributes({username, email, phone})
          })
          .promise()
          .then(({User}) => Promise.all([
            cognito
              .adminSetUserPassword({
                Password: password, /* required */
                UserPoolId: awsmobile.aws_user_pools_id, /* required */
                Username: User.Username, /* required */
                Permanent: true
              })
              .promise(),
              cognito
                .adminAddUserToGroup({
                  GroupName: 'Admins', /* required */
                  UserPoolId: awsmobile.aws_user_pools_id, /* required */
                  Username: User.Username /* required */
                })
                .promise()
          ]))
          .catch(err => console.log("Already Created it") || Promise.resolve(null))
      )
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )
