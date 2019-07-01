import AWS from 'aws-sdk';
import axios from 'axios';
import awsmobile from '../amplify/src/aws-exports';

const providerName = `cognito-idp.us-east-1.amazonaws.com/${awsmobile.aws_user_pools_id}:${awsmobile.aws_user_pools_web_client_id}`;

const secretsClient = new AWS.SecretsManager({
  region: awsmobile.aws_appsync_region
});

const cognitoClient = () => new AWS.CognitoIdentityServiceProvider({
  region: awsmobile.aws_appsync_region,
  apiVersion: '2016-04-18'
})

const iamClient = new AWS.IAM({
  region: awsmobile.aws_appsync_region,
})

const cognitoIdentityClient = new AWS.CognitoIdentity({
  region: awsmobile.aws_appsync_region,
})

const getUserAttributes = ({username, email, phone}) => {
  const attributes = [
    {Name: "name", Value: "Admin"},
    {Name: "email", Value: (email || username)},
    {Name: "email_verified", Value: "true"}
  ]

  if(!phone) {
    return attributes;
  }

  return [
    ...attributes,
    ...[
      {Name: "phone_number", Value: phone},
      {Name: "phone_number_verified", Value: "true"}
    ]
  ]
}

// eslint-disable-next-line import/prefer-default-export
export const createIdentityPoolMapping = (event, context) =>
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    iamClient
      .listRoles()
      .promise()
      .then(({Roles}) => Promise.resolve({
        authRoleArn: Roles.find(role => role.RoleName.endsWith('-authRole')).Arn,
        unauthRoleArn: Roles.find(role => role.RoleName.endsWith('-unauthRole')).Arn
      }))
      .then(({authRoleArn, unauthRoleArn}) =>
        cognitoIdentityClient
          .listIdentityPools({MaxResults: 10})
          .promise()
          .then(({IdentityPools}) => IdentityPools[0].IdentityPoolName)
          .then(identityPoolName => 
            cognitoIdentityClient
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

  

// eslint-disable-next-line import/prefer-default-export
export const createAdminUser = (event, context) =>
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    secretsClient
      .getSecretValue({SecretId: 'AdminUserSecret'})
      .promise()
      .then(secret => Promise.resolve(JSON.parse(secret.SecretString)) )
      .then(({username, password, email, phone}) =>
        cognitoClient()
          .adminCreateUser({
            UserPoolId: awsmobile.aws_user_pools_id, /* required */
            Username: username, /* required */
            DesiredDeliveryMediums: !!phone ? [ "EMAIL", "PHONE"] : [ "EMAIL" ]  ,
            TemporaryPassword: password,
            UserAttributes: getUserAttributes({username, email, phone})
          })
          .promise()
          .then(({User}) => Promise.all([
            cognitoClient()
              .adminSetUserPassword({
                Password: password, /* required */
                UserPoolId: awsmobile.aws_user_pools_id, /* required */
                Username: User.Username, /* required */
                Permanent: true
              })
              .promise(),
              cognitoClient()
                .adminAddUserToGroup({
                  GroupName: 'Admins', /* required */
                  UserPoolId: awsmobile.aws_user_pools_id, /* required */
                  Username: User.Username /* required */
                })
          ]))
      )
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )


// eslint-disable-next-line import/prefer-default-export
export const getStackLastUpdatedTime = (event, context) => 
  new AWS.CloudFormation().describeStacks({
    StackName: event.params.stackName
  })
    .promise()
    .then(data => Promise.resolve({
      requestId: event["requestId"],
      status: "success",
      fragment: { LastUpdatedTime: data.Stacks[0].LastUpdatedTime }
    }))
    .catch(error => Promise.resolve({
      requestId: event["requestId"],
      status: "failed",
      fragment: { LastUpdatedTime: "" }
    }))


// eslint-disable-next-line import/prefer-default-export
export const sendVerificationEmail = async (event, context) => (
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    new AWS.SES()
      .verifyEmailIdentity({EmailAddress: process.env.SYSTEM_EMAIL_ADDRESS})
      .promise()
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )
)

// eslint-disable-next-line import/prefer-default-export
export const verifyDomain = async (event, context) => (
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    new AWS.SES()
      .verifyDomainIdentity({Domain: process.env.DOMAIN_NAME})
      .promise()
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )
)

// eslint-disable-next-line import/prefer-default-export
export const verifyDkim = async (event, context) => (
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    new AWS.SES()
      .verifyDomainDkim({Domain: process.env.DOMAIN_NAME})
      .promise()
      .then(data => ({
        ChangeBatch: {
         Changes: data.DkimTokens.map(token => ({
          Action: "CREATE", 
          ResourceRecordSet: {
            Name: token + "._domainkey." + process.env.DOMAIN_NAME, 
            ResourceRecords: [
              {
                Value: token + ".dkim.amazonses.com"
              }
            ], 
            TTL: 60, 
            Type: "CNAME"
          }
        })), 
         Comment: "DKIM Tokens"
        }, 
        HostedZoneId: event.ResourceProperties.HostedZoneId
       }))
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )
)

const sendResponse = async (
  event,
  context,
  responseStatus,
  responseData,
  physicalResourceId
) => {
  const reason =
    responseStatus == "FAILED"
      ? "See the details in CloudWatch Log Stream: " + context.logStreamName
      : undefined;

  const responseBody = JSON.stringify({
    StackId: event.StackId,
    RequestId: event.RequestId,
    Status: responseStatus,
    Reason: reason,
    PhysicalResourceId: physicalResourceId || context.logStreamName,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData
  });

  const responseOptions = {
    headers: {
      "Content-Type": "",
      "Content-Length": responseBody.length
    }
  };

  console.info("Response body:\n", responseBody);

  try {
    await axios.put(event.ResponseURL, responseBody, responseOptions);
    console.info("CloudFormationSendResponse Success");
  } catch (error) {
    console.error("CloudFormationSendResponse Error:");
    if (error.response) {
      console.error(error.response);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    console.error(error.config);
    throw new Error("Could not send CloudFormation response");
  }
};