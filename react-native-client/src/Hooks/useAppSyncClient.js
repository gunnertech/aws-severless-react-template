import { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify';

import { Cache } from 'aws-amplify';

import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from "aws-appsync";
import { withClientState } from 'apollo-link-state';

import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';


import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';


import appSyncConfig from "../../aws-exports";


const url = appSyncConfig.aws_appsync_graphqlEndpoint;
const region = appSyncConfig.aws_appsync_region;
const auth = {
  type: appSyncConfig.aws_appsync_authenticationType,
  jwtToken: async () => {
    console.log("OK OK OK")
    try {
      const session = await Auth.currentSession();
      return await session.getIdToken().getJwtToken();
    } catch(e) {
      if(!!process.env.REACT_APP_guest_user_name && !!process.env.REACT_APP_guest_password) {
        const existingToken = await Cache.getItem('jwtToken');

        if(existingToken) {        
          return existingToken;
        }

        await Auth.signIn(process.env.REACT_APP_guest_user_name, process.env.REACT_APP_guest_password);
        const session = await Auth.currentSession();
        const newToken = await session.getIdToken().getJwtToken();
        await Cache.setItem('jwtToken', newToken, { expires: moment().add(10, 'minutes').toDate().getTime()});
        await Auth.signOut();
        return newToken;
      }

      return null;

    }
  },
  // apiKey: appSyncConfig.aws_appsync_apiKey,
};

const httpLink = createHttpLink({ uri: url });

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink(url, httpLink)
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})


// const defaults = {};
// const resolvers = {};
// const typeDefs = ``;

// const stateLink = createLinkWithCache(cache => withClientState({ 
//   resolvers, 
//   defaults, 
//   cache, 
//   typeDefs 
// }));


// const appSyncLink = createAppSyncLink({
//   url: appSyncLink.aws_appsync_graphqlEndpoint,
//   region: appSyncLink.aws_appsync_region,
//   auth: {
//     type: "AMAZON_COGNITO_USER_POOLS",
//     jwtToken: async () => {
//       try {
//         const session = await Auth.currentSession();
//         return await session.getIdToken().getJwtToken();
//       } catch(e) {
//         if(!!process.env.REACT_APP_guest_user_name && !!process.env.REACT_APP_guest_password) {
//           const existingToken = await Cache.getItem('jwtToken');

//           if(existingToken) {        
//             return existingToken;
//           }

//           await Auth.signIn(process.env.REACT_APP_guest_user_name, process.env.REACT_APP_guest_password);
//           const session = await Auth.currentSession();
//           const newToken = await session.getIdToken().getJwtToken();
//           await Cache.setItem('jwtToken', newToken, { expires: moment().add(10, 'minutes').toDate().getTime()});
//           await Auth.signOut();
//           return newToken;
//         }

//         return null;

//       }
//     },
//   },
// });

// const link = ApolloLink.from([stateLink, appSyncLink]);

// const client = new AWSAppSyncClient({disableOffline: true}, { link });

export default useAppSyncClient = () => {
  const [appSyncClient, setAppSyncClient] = useState(client);

  useEffect(() => {
    return () => setAppSyncClient(null)
  }, []);

  return appSyncClient;
}