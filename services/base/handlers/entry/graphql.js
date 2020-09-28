import { appsync } from '../clients';
import { handle } from 'handlers/graphql';
import Entry from 'react-shared/api/Entry';

const debitWallet = () =>
  Promise.resolve("TODO")

const creditWallet = () =>
  Promise.resolve("TODO")

const accumulateEntriesForSale = ({user, provider, limit, nextToken, accumulatedEntries}) =>
  appsync.query({
    fetchPolicy: "network-only",
    query: Entry.queries.listByStatusAndListedForSaleAt,
    variables: {
      status: "ACTIVE",
      limit,
      nextToken,
      listedForSaleAt: {
        gt: "2019-09-24T01:51:55.392Z"
      },
      withLocales: true,
      withProviders: true
    }
  })
  .then(({data: {listEntriesByStatusAndListedForSaleAt: {nextToken, items: entries = []} = {}} = {}}) => ({
    nextToken,
    items: entries.filter(entry => 
      entry.localeEntries.items.map(le => le.localeId).includes(user.localeId) &&
      entry.providerEntries.items.map(pe => pe.providerId).includes(provider.id)
    )
  }))
  .then(({nextToken, items}) => 
    items.length >= limit || !nextToken ? ({
      items: [...(accumulatedEntries??[]), ...(items??[])],
      nextToken
    }) : (
      accumulateEntriesForSale({user, status, limit, nextToken, accumulatedEntries: [...(accumulatedEntries??[]), ...(items??[])]})
    )
  )

const resolvers = {
  Query: { //event.arguments
    myEntries: ({prev: {result: {user, provider}} , arguments: {status, limit, nextToken} }) =>
      appsync.query({
        fetchPolicy: "network-only",
        query: Entry.queries.listByUserIdAndStatus,
        variables: {
          entryUserId: user?.id,
          status: {
            eq: status
          },
          limit,
          nextToken
        }
      })
      .then(({data: {listEntriesByUserIdAndStatus: {nextToken, items: entries = []} = {}} = {}}) => ({
        nextToken,
        items: entries
      }))
    ,
    listEntriesEligibleForPurchase: ({prev: {result: {user, provider}} , arguments: {limit, nextToken} }) =>
      accumulateEntriesForSale({user, provider, limit, nextToken})
    ,
    listVisibleEntries: ({prev: {result: {user}} , arguments: {limit, nextToken, status} }) =>
      appsync.query({
        fetchPolicy: "network-only",
        query: Entry.queries.listByStatus,
        variables: {
          status,
          limit,
          nextToken
        }
      })
      .then(({data: {listEntriesByStatus: {nextToken, items: entries = []} = {}} = {}}) => ({
        nextToken,
        items: entries.filter(entry => 
          entry.localeEntries.items.map(le => le.localeId).includes(user.localeId) &&
          entry.providerEntries.items.map(pe => pe.providerId).includes(user.providerId)
        )
      }))
  },
  Mutation: { //event.identity, event.prev.result
    buyEntry: event =>
      !event?.prev?.result?.canBuy ? Promise.reject({message: "You do not have permission to do that"}) : (
        appsync.query({
          fetchPolicy: "network-only",
          query: Entry.queries.get,
          variables: {
            id: event.arguments.input.id
          }
        })
        .then(({data: {getEntry}}) =>
          ///TODO: What do we do if one of these fails? What if debit succeeds and credit fails?
          debitWallet(event.arguments.input.buyerPaymentToken)
            .then(() => creditWallet(getEntry.sellerPaymentToken))
            .then(() => 
              appsync.mutate({
                mutation: Entry.mutations.update,
                variables: {
                  input: {
                    id: event.arguments.input.id,
                    entryUserId: event.prev.result.user.id,
                    isListedForSale: false
                  }
                }
              })
                .then(({data: {updateEntry}}) => updateEntry)
          )
        )
      )
    ,
    postEntryForSale: event =>
      !event?.prev?.result?.canList ? Promise.reject({message: "You do not have permission to do that"}) : (
        appsync.mutate({
          mutation: Entry.mutations.update,
          variables: {
            input: {
              id: event.arguments.input.id,
              isListedForSale: true,
              ...event.arguments.input
            }
          }
        })
        .then(({data: {updateEntry}}) => updateEntry)
      )
    ,
    unlistEntry: event =>
      !event?.prev?.result?.canUnlist ? Promise.reject({message: "You do not have permission to do that"}) : (
        appsync.mutate({
          mutation: Entry.mutations.update,
          variables: {
            input: {
              id: event.arguments.input.id,
              isListedForSale: false,
              listingExpiresAt: null
            }
          }
        })
        .then(({data: {updateEntry}}) => updateEntry)
      )
  }
}

// eslint-disable-next-line import/prefer-default-export
export const js = handle(resolvers)