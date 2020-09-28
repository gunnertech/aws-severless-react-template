import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Period from 'react-shared/api/Period';



const action = "INSERT";
const periodCount = 4;

const createPeriods = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
      Promise.all(
        Array.from(Array(periodCount).keys()).map(i =>
          appsync.mutate({
            mutation: Period.mutations.create,
            variables: {
              input: {
                gameId: newRecord.id,
                number: i+1,
                status: "PRE",
                confirmed: false,
                homeScore: 0,
                awayScore: 0
              }
            }
          })
        )
      )
    )

const pipes = [
  createPeriods
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
