import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Game from 'react-shared/api/Game';



const action = "INSERT";

const setCurrentPlay = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.mutate({
        mutation: Game.mutations.update,
        variables: {
          input: {
            id: newRecord.gameId,
            gameCurrentPlayId: newRecord.id
          }
        }
      })
    )

const pipes = [
  setCurrentPlay
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
