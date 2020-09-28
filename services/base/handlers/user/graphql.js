import { appsync } from '../clients';
import { handle } from 'handlers/graphql';
import User from 'react-shared/api/User';

const resolvers = {
  Query: { //event.arguments
    // getUserByProviderIdAndUuid: ({prev: {result: {provider}} , arguments: {uuid, localeId} }) =>
    me: event =>
      console.log("OK OK", JSON.stringify(event)) ||
      Promise.resolve(event.prev.result.user)
    ,
    getUserByUuidAndLocaleId: ({prev: {result: {provider}} , arguments: {uuid, localeId} }) =>
      appsync.query({
        fetchPolicy: "network-only",
        query: User.queries.listByProviderIdAndUuid,
        variables: {
          providerId: provider.id,
          uuid: {
            eq: uuid
          }
        }
      })
      .then(({data: {listUsersByProviderIdAndUuid: {items: users = []} = {}} = {}}) => 
        !!users[0] ? users[0] : 
        appsync.mutate({
          mutation: User.mutations.create,
          variables: {
            input: {
              localeId,
              uuid,
              providerId: provider.id
            }
          }
        })
          .then(({data: {createUser}}) => createUser)
      )
  },
  Mutation: { //event.identity, event.prev.result
  
  }
}

// eslint-disable-next-line import/prefer-default-export
export const js = handle(resolvers)