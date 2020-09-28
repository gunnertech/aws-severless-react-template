import { appsync } from '../clients';
import Entry from 'react-shared/api/Entry';


// eslint-disable-next-line import/prefer-default-export
export const js = event => 
  console.log("PRIVLEDGES", JSON.stringify(event)) ||
  appsync.query({
    fetchPolicy: "network-only",
    query: Entry.queries.get,
    variables: { 
      id: event.arguments?.input?.id,
      withLocales: true,
      withProviders: true
    }
  })
    .then(({data: {getEntry: entry}}) => ({
      ...event.prev.result,
      canBuy: ( // IF THE ENTRY IS OPEN OR MATCHES ITS LAST STATE
        !entry?.entryUserId || (
          entry.entryUserId === event.prev.result.user.id &&
          entry?.status === 'ACTIVE' &&
          entry?.askingPrice === event.arguments?.input?.price &&
          entry.providerEntries.items.map(pe => pe.providerId).includes(event.prev.result.user.providerId) &&
          entry.localeEntries.items.map(le => le.localeId).includes(event.prev.result.user.localeId)
        )
      )
      ,
      canList: entry?.entryUserId === event.prev.result.user.id && entry?.status === 'ACTIVE',
      canUnlist: entry?.entryUserId === event.prev.result.user.id && entry?.status === 'ACTIVE',
    }))
  
  