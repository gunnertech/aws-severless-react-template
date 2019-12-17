import { appsync } from './clients';
import User from '../src/api/User';



// eslint-disable-next-line import/prefer-default-export
export const js = (event, context, callback) => 
  appsync.query({
    query: User.queries.list,
    fetchPolicy: "network-only",
    variables: {
      limit: 1000,
    }
  })
    .then(resp =>
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(resp),
      })
    )
    .catch(err => console.log("ERROR:", JSON.stringify(err)) || callback(err))