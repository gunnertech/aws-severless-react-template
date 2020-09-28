import { appsync } from '../clients';
import { handle } from 'handlers/graphql';
import Bid from 'react-shared/api/Bid';
import EntryBid from 'react-shared/api/EntryBid';
import Entry from 'react-shared/api/Entry';

const resolvers = {
  Query: {

  },
  Mutation: { //event.identity, event.prev.result
    rejectBid: event =>
      !event?.prev?.result?.canReject ? Promise.reject({message: "You do not have permission to do that"}) : (
        appsync.mutate({
          mutation: Bid.mutations.update,
          variables: {
            input: {
              id: event.arguments.input.id,
              status: "REJECTED"
            }
          }
        })
        .then(({data: {updateBid}}) => updateBid)
      )
    ,
    acceptBid: event =>
      !event?.prev?.result?.canAccept ? Promise.reject({message: "You do not have permission to do that"}) : (
        ///TODO: What do we do if one of these fails? What if debit succeeds and credit fails?
        debitWallet(updateBid.buyerPaymentToken)
        .then(() => creditWallet(event.arguments.input.sellerPaymentToken))
        .then(() => 
          appsync.mutate({
            mutation: Bid.mutations.update,
            variables: {
              input: {
                id: event.arguments.input.id,
                status: "ACCEPTED"
              }
            }
          })
        )
        .then(({data: {updateBid}}) => updateBid)
      )
    ,
    cancelBid: event =>
      !event?.prev?.result?.canCancel ? Promise.reject({message: "You do not have permission to do that"}) : (
        appsync.mutate({
          mutation: Bid.mutations.update,
          variables: {
            input: {
              id: event.arguments.input.id,
              status: "CANCELED"
            }
          }
        })
        .then(({data: {updateBid}}) => updateBid)
      )
    ,
    createNewBid: event =>
      console.log("OK FINE", JSON.stringify(event)) ||
      !event?.prev?.result?.canCreate ? Promise.reject({message: "Insufficient funds"}) : (
        appsync.query({
          fetchPolicy: "network-only",
          query: Entry.queries.get,
          variables: { id: event.arguments.input.entryId }
        })
          .then(({data: {getEntry}}) => getEntry)
          .then(entry => 
            appsync.mutate({
              mutation: Bid.mutations.create,
              variables: {
                input: {
                  userId: event.prev.result.user.id,
                  offerPrice: event.arguments.input.offerPrice,
                  entryId: event.arguments.input.entryId,
                  entryOwnerId: entry.entryUserId,
                  status: "PENDING",
                  buyerPaymentToken: event.arguments.input.buyerPaymentToken
                }
              }
            })
              .then(({data: {createBid}}) => 
                Promise.all((event.arguments?.input?.entryIds||[]).map(entryId => 
                  appsync.mutate({
                    mutation: EntryBid.mutations.create,
                    variables: {
                      input: {
                        entryId,
                        bidId: createBid.id
                      }
                    }
                  })
                ))
                .then(() => createBid)
                .catch(e => //If something goes wrong when creating the joins, delete the whole bid and throw an error
                  appsync.mutate({
                    mutation: Bid.mutations.delete,
                    variables: {
                      input: {
                        id: createBid.id
                      }
                    }
                  })
                  .then(() => Promise.reject(e))
                )
              )
          )
      )
  }
}

// eslint-disable-next-line import/prefer-default-export
export const js = handle(resolvers)