import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Entry from 'react-shared/api/Entry';



const action = "INSERT";

const createEntries = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
      Promise.all(
        Array.from(Array(newRecord.capacity).keys()).map(i =>
          appsync.mutate({
            mutation: Entry.mutations.create,
            variables: {
              input: {
                gameId: newRecord.gameId,
                poolId: newRecord.id,
                boxNumber: i+1,
                askingPrice: newRecord.entryFee,
                status: "CREATED",
                isListedForSale: false,
                listedForSaleAt: null,
                isEligibleForMarketplace: false
              }
            }
          })
        )
      )
    )

const pipes = [
  createEntries
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
