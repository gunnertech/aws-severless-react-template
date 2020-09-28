import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Entry from 'react-shared/api/Entry';
import ProviderEntry from 'react-shared/api/ProviderEntry';



const action = "INSERT";
 
//({data: {listEntriesByPoolId: {items = []}}}

const createProviderEntries = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.query({
        fetchPolicy: "network-only",
        query: Entry.queries.listByPoolId,
        variables: {
          poolId: newRecord.poolId,
          limit: 100
        }
      })
        .then(entry =>
          Promise.all(
            entry.data.listEntriesByPoolId.items.map(item =>
              appsync.mutate({
                mutation: ProviderEntry.mutations.create,
                variables: {
                  input: {
                    providerId: newRecord.providerId,
                    entryId: item.id
                  }
                }
              })
            )
          )
        )
    )

const pipes = [
  createProviderEntries
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
