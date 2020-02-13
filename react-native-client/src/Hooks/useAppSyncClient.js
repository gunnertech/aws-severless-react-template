/* eslint-disable */

import { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify';

import AWSappSyncClient, { AUTH_TYPE } from "aws-appsync";


import appSyncConfig from "../../aws-exports";

// Client 1 uses API_KEY as auth type
const apiKeyClient = new AWSappSyncClient({
  url: appSyncConfig.aws_appsync_graphqlEndpoint,
  region: appSyncConfig.aws_appsync_region,
  auth: { type: AUTH_TYPE.AWS_IAM, credentials: () => Auth.currentCredentials()},
  disableOffline: true,
});

// Client 2 uses AMAZON_COGNITO_USER_POOLS as auth type, leverages Amplify's token handling/refresh
const cognitoClient = new AWSappSyncClient({
  url: appSyncConfig.aws_appsync_graphqlEndpoint,
  region: appSyncConfig.aws_appsync_region,
  disableOffline: true,
  auth: { 
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  }
});



const useAppSyncClient = cognitoUser => {

  const [appSyncClient, setAppSyncClient] = useState(null);

  useEffect(() => {
    setAppSyncClient(cognitoUser === undefined ? null : !!cognitoUser ? cognitoClient : apiKeyClient)
    
    return () => setAppSyncClient(null)
  }, [JSON.stringify(cognitoUser)]);

  return appSyncClient;
}

export default useAppSyncClient;