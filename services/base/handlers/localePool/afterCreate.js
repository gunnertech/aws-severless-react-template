import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Entry from 'react-shared/api/Entry';
import LocaleEntry from 'react-shared/api/LocaleEntry';



const action = "INSERT";
 
//({data: {listEntriesByPoolId: {items = []}}}

const createLocaleEntries = recordMaps => 
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
                mutation: LocaleEntry.mutations.create,
                variables: {
                  input: {
                    localeId: newRecord.localeId,
                    entryId: item.id
                  }
                }
              })
            )
          )
        )
    )

const pipes = [
  createLocaleEntries
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
