import { appsync } from '../clients';
import User from 'react-shared/api/User';
import Provider from 'react-shared/api/Provider';
import { AES, enc } from 'crypto-js';

 //event.identity.claims

const getProviderIdFromClaims = claims =>
  Promise.resolve(
    claims?.['cognito:groups']?.find?.(groupName => /Providers/.test(groupName))?.replace?.(/Providers\-/, "") ?? "de331d6f-4df2-413d-898b-b15760d297a4"
  )

// async ({headers: { uuid, localeId }, identity: { claims, username } }) =>
// eslint-disable-next-line import/prefer-default-export
export const js = event =>
  console.log("HERE IT IS", JSON.stringify(event)) ||
  getProviderIdFromClaims({claims: event.identity.claims})
    .then(providerId => ({
      providerId,
      uuid: event.request?.headers?.uuid,
      // uuid: AES.decrypt(uuid, (providerId??"none")).toString(enc.Utf8)
    }))
    .then(({providerId, uuid}) => console.log("got it", providerId, uuid) ||
      Promise.all([
        !event.request?.headers?.uuid ? null :
        appsync.query({
          fetchPolicy: "network-only",
          query: User.queries.listByProviderIdAndUuid,
          variables: {
            providerId,
            uuid: {
              eq: event.request?.headers?.uuid
            }
          }
        })
        .then(({data: {listUsersByProviderIdAndUuid: {items}}}) =>
          !!items?.length ? (
            items[0]
          ) : (
            console.log("VARS!!", JSON.stringify({
              localeId: event.request?.headers?.localeid,
              providerId,
              uuid: event.request?.headers?.uuid
            })) ||
            appsync.mutate({
              mutation: User.mutations.create,
              variables: {
                input: {
                  localeId: event.request?.headers?.localeid,
                  providerId,
                  uuid: event.request?.headers?.uuid
                }
              }
            })
              .then(({data: {createUser}}) => createUser)
          )
        )
        ,
        !providerId ? null :
        appsync.query({
          fetchPolicy: "network-only",
          query: Provider.queries.get,
          variables: {
            id: providerId
          }
        })
        .then(({data: {getProvider}}) => getProvider)
      ])
    )
    .then(([user, provider]) => ({
      provider,
      user
    }))
  
  