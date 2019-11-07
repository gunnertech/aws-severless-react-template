import 'cross-fetch/polyfill';
import gql from 'graphql-tag';
import SecretsManager from 'aws-sdk/clients/secretsmanager';
import SQS from 'aws-sdk/clients/sqs';
import SES from 'aws-sdk/clients/ses';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import CloudFormation from 'aws-sdk/clients/cloudformation';
import CognitoIdentityServiceProvider  from 'aws-sdk/clients/cognitoidentityserviceprovider';
import IAM  from 'aws-sdk/clients/iam';
import CognitoIdentity  from 'aws-sdk/clients/cognitoidentity';

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

import AWSAppSyncClient from "aws-appsync";

import awsmobile from '../aws-exports';

const cognitoidentity = new CognitoIdentity({
  region: awsmobile.aws_appsync_region,
})

const cloudformation = new CloudFormation({
  region: awsmobile.aws_appsync_region
})

const secrets = new SecretsManager({
  region: awsmobile.aws_appsync_region
});

const sqs = new SQS({
  region: awsmobile.aws_appsync_region
});

const ses = new SES({
  region: awsmobile.aws_appsync_region
});

const dynamodb = new DynamoDB({
  apiVersion: '2012-08-10',
  region: awsmobile.aws_appsync_region
});

const cognito = new CognitoIdentityServiceProvider({
  region: awsmobile.aws_appsync_region,
  apiVersion: '2016-04-18'
})

const iam = new IAM({
  region: awsmobile.aws_appsync_region,
})



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

const appsync = new AWSAppSyncClient({
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  disableOffline: true,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => {
      try {
        if(!AdminCredentials.username) {
          const secret = await secrets.getSecretValue({SecretId: 'AdminUserSecret'}).promise();
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

export { appsync, secrets, sqs, ses, dynamodb, cloudformation, cognito, iam, cognitoidentity };