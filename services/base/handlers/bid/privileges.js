import { appsync } from '../clients';
// import { getUserRecord } from 'handlers/cognito';
import Bid from 'react-shared/api/Bid';
import Entry from 'react-shared/api/Entry';
// import { ownsAllOfferedEntries } from 'react-shared/Util';

const ownsAllOfferedEntries = (client, entryIds, userId) =>
  Promise.all((entryIds||[]).map(entryId => 
    client.query({
      fetchPolicy: "network-only",
      query: Entry.queries.get,
      variables: { id: entryId }
    })
    .then(({getEntry}) => getEntry)
  ))
  .then(entries => entries.every(entry => entry.entryUserId === userId))


// eslint-disable-next-line import/prefer-default-export
export const js = async event => 
  (!event.arguments?.input?.id ? Promise.resolve(null) : (
    appsync.query({
      fetchPolicy: "network-only",
      query: Bid.queries.get,
      variables: { id: event.arguments?.input?.id }
    })
    .then(({data: {getBid}}) => getBid)
  ))
  .then(bid => Promise.all([
    bid,
    ownsAllOfferedEntries(appsync, event.arguments?.input?.entryIds, (bid?.userId || event.prev.result.user.id))
  ]))
  .then(([bid, ownsAllOfferedEntries]) => ({
    ...event.prev.result,
    canCancel: bid?.userId === event.prev.result.user.id && bid?.status === 'PENDING',
    canReject: bid?.entryOwnerId === event.prev.result.user.id && bid?.status === 'PENDING',
    canAccept: (
      bid?.entryOwnerId === event.prev.result.user.id && 
      bid?.offerPrice === event.arguments?.input?.offerPrice && 
      bid?.status === 'PENDING' && 
      ownsAllOfferedEntries
    ),
    canCreate: ownsAllOfferedEntries
  }))
  