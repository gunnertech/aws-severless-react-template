import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Game from 'react-shared/api/Game';


const action = "MODIFY";


const setCurrentPeriod = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => newRecord.status === "IN" && oldRecord.status !== "IN")
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.mutate({
        mutation: Game.mutations.update,
        variables: {
          input: {
            id: newRecord.gameId,
            gameCurrentPeriodId: newRecord.id
          }
        }
      })
    )

const pipes = [
  setCurrentPeriod
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
