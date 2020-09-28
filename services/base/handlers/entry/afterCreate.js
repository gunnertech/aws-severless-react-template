import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import EntryHistory from 'react-shared/api/EntryHistory';



const action = "INSERT";

const createEntryHistory = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
        appsync.mutate({
          mutation: EntryHistory.mutations.create,
          variables: {
            input: {
              entryId: newRecord.id,
              type: "CREATED",
            }
          }
        })
      )

const pipes = [
  createEntryHistory
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
