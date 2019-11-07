import awsmobile from '../../aws-exports';
import { iam, cognitoidentity } from "../clients"

import {
  sendResponse,
  providerName
} from "./index"


// eslint-disable-next-line import/prefer-default-export
export const js = (event, context) =>
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    iam
      .listRoles()
      .promise()
      .then(({Roles}) => Promise.resolve({
        authRoleArn: Roles.find(role => role.RoleName.endsWith('-authRole')).Arn,
        unauthRoleArn: Roles.find(role => role.RoleName.endsWith('-unauthRole')).Arn
      }))
      .then(({authRoleArn, unauthRoleArn}) =>
        cognitoidentity
          .listIdentityPools({MaxResults: 10})
          .promise()
          .then(({IdentityPools}) => IdentityPools[0].IdentityPoolName)
          .then(identityPoolName => 
            cognitoidentity
              .setIdentityPoolRoles({
                IdentityPoolId: awsmobile.aws_cognito_identity_pool_id, /* required */
                Roles: { /* required */
                  'authenticated': authRoleArn,
                  'unauthenticated': unauthRoleArn,
                },
                RoleMappings: {
                  [providerName]: {
                    Type: "Rules", /* required */
                    AmbiguousRoleResolution: "AuthenticatedRole",
                    RulesConfiguration: {
                      Rules: [ /* required */
                        {
                          Claim: 'cognito:groups', /* required */
                          MatchType: "Contains", /* required */
                          RoleARN: event.ResourceProperties.CognitoAdminsRoleArn, /* required */
                          Value: 'Admins' /* required */
                        },
                        {
                          Claim: 'amr', /* required */
                          MatchType: "Contains", /* required */
                          RoleARN: authRoleArn, /* required */
                          Value: 'authenticated' /* required */
                        },
                      ]
                    }
                  },
                }
              })
              .promise()
          )
      )
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )