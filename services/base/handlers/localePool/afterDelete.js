import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Entry from 'react-shared/api/Entry';
import LocaleEntry from 'react-shared/api/LocaleEntry';



const action = "REMOVE";

const deleteLocaleEntries = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.query({
        fetchPolicy: "network-only",
        query: Entry.queries.listByPoolId,
        variables: {
          poolId: oldRecord.poolId,
          limit: 100
        }
      })
        .then(({data: {listEntriesByPoolId: {items = []}}}) =>
          Promise.all(
            items.map(item =>
              appsync.query({
                fetchPolicy: "network-only",
                query: LocaleEntry.queries.listByEntryId,
                variables: {
                  entryId: item.id,
                  limit: 100
                }
              })
                .then(({data: {listLocaleEntriesByEntryId: {items = []}}}) =>
                  Promise.all(
                    items.map(item =>
                      appsync.mutate({
                        mutation: LocaleEntry.mutations.delete,
                        variables: {
                          input: {
                            id: item.id
                          }
                        }
                      })
                    )        
                  )
                )
            ) 
          )
        )
    )

const pipes = [
  deleteLocaleEntries
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
