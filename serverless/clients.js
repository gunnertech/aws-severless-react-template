import 'cross-fetch/polyfill';
import awsmobile from '../amplify/src/aws-exports';

import AWS from 'aws-sdk';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

import AWSAppSyncClient from "aws-appsync";


AWS.config.update({
  region: awsmobile.aws_appsync_region
});

const secretsClient = new AWS.SecretsManager({
  region: awsmobile.aws_appsync_region
});


const jwtTokenForUser = (username, password) => 
  new Promise((resolve, reject) =>
    new CognitoUser({
      Username: username,
      Pool: new CognitoUserPool({ 
        UserPoolId: awsmobile.aws_user_pools_id,
        ClientId: awsmobile.aws_user_pools_web_client_id
      })
    })
    .authenticateUser(new AuthenticationDetails({
        Username: username,
        Password: password,
      }), {
        onSuccess: result => result.getAccessToken().getJwtToken() && resolve(result.idToken.jwtToken),
        onFailure: err => console.log("ERROR", err) || reject(err),
      })
  )

const AdminCredentials = {};

const appSyncClient = new AWSAppSyncClient({
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  disableOffline: true,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => {
      try {
        if(!AdminCredentials.username) {
          const secret = await secretsClient.getSecretValue({SecretId: 'AdminUserSecret'}).promise();
          const secretObject = JSON.parse(secret.SecretString)
          AdminCredentials.username = secretObject.username;
          AdminCredentials.password = secretObject.password;
        }
        
        const jwtToken = await jwtTokenForUser(AdminCredentials.username, AdminCredentials.password);

        return jwtToken;
      } catch(e) {
        console.log(e);
        return null;
      }
    },
  },
});

export { appSyncClient, secretsClient };