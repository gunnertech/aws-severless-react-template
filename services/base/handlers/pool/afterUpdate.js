import { appsync } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import LocalePool from 'react-shared/api/LocalePool';
import ProviderPool from 'react-shared/api/ProviderPool';
import Pool from 'react-shared/api/Pool';
import Entry from 'react-shared/api/Entry';

const generateNumbers = () => {
  let arr = [];
  while(arr.length < 10){
    const r = Math.floor(Math.random() * 10);
    if(arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}


const action = "MODIFY";

const checkEntries = pool => 
  appsync.query({
    query: Entry.queries.listByPoolId,
    variables: {
      poolId: pool.id,
      limit: 200,
      fetchPolicy: "network-only"
    }
  })
    .then(({data: {listEntriesByPoolId: {items}}}) => 
      items?.length >= pool.capacity ? (
        Promise.resolve(pool)
      ) : (
        checkEntries(pool)
      )
    )


const replicatePool = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => 
      newRecord.threshold * newRecord.capacity >= newRecord.entriesCount && 
      !newRecord.hasBeenReplicated &&
      !newRecord.private
    )
    .map(({newRecord, oldRecord, ...rest}) => 
      Promise.all([
        appsync.mutate({
          mutation: Pool.mutations.update,
          variables: {
            input: {
              id: newRecord.id,
              hasBeenReplicated: true
            }
          }
        }),
        appsync.mutate({
          mutation: Pool.mutations.create,
          variables: {
            input: {
              hasBeenReplicated: false,
              leagueId: newRecord.leagueId,
              gameId: newRecord.gameId,
              entryFee: newRecord.entryFee,
              private: false,
              entriesCount: 0,
              capacity: newRecord.capacity,
              threshold: newRecord.threshold,
              awayScoringIndex: newRecord.awayScoringIndex,
              homeScoringIndex: newRecord.homeScoringIndex,
              status: newRecord.status
            }
          }
        })
          .then(({data: {createPool}}) => 
            checkEntries(createPool)
          )
          .then(newPool =>
            Promise.all([
              appsync.query({
                fetchPolicy: "network-only",
                query: LocalePool.queries.listByPoolId,
                variables: {
                  poolId: newRecord.id,
                  limit: 1000
                }
              })
              .then(({data: {listLocalePoolsByPoolId: {items}}}) => items)
              ,
              appsync.query({
                fetchPolicy: "network-only",
                query: ProviderPool.queries.listByPoolId,
                variables: {
                  poolId: newRecord.id,
                  limit: 1000
                }
              })
                .then(({data: {listProviderPoolsByPoolId: {items}}}) => items)
            ])
              .then(([localePools, providerPools]) =>
                Promise.all([
                  Promise.all(localePools.map(lp => 
                    appsync.mutate({
                      mutation: LocalePool.mutations.create,
                      variables: {
                        input: {
                          localeId: lp.localeId,
                          poolId: newPool.id
                        }
                      }
                    })
                  )),
                  Promise.all(providerPools.map(pp => 
                    appsync.mutate({
                      mutation: ProviderPool.mutations.create,
                      variables: {
                        input: {
                          providerId: pp.providerId,
                          poolId: newPool.id
                        }
                      }
                    })
                  ))
                ])
              )
          )
      ]),
    )
      

const assignNumbers = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => newRecord.status === 'LIVE' && oldRecord.status === 'CREATED')
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.mutate({
        mutation: Pool.mutations.update,
        variables: {
          input: {
            id: newRecord.id,
            awayScoringIndex: generateNumbers(),
            homeScoringIndex: generateNumbers(),
          }
        }
      })
    )

const goLive = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => newRecord.status === 'CREATED' && newRecord.entriesCount === newRecord.capacity)
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.mutate({
        mutation: Pool.mutations.update,
        variables: {
          input: {
            id: newRecord.id,
            status: "LIVE"
          }
        }
      })
    )

const pipes = [
  assignNumbers,
  goLive,
  replicatePool
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
