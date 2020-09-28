import { appsync, dynamodb } from 'handlers/clients';
import { handle } from 'handlers/triggers';
import Pool from 'react-shared/api/Pool';
import EntryHistory from 'react-shared/api/EntryHistory';
import UserPool from 'react-shared/api/UserPool';


const action = "MODIFY";

const poolTableName = JSON.parse(process.env.TABLES).Pool;

const createUserPoolEntry = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => !!newRecord.entryUserId)
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.query({
        query: UserPool.queries.listByUserId,
        variables: {
          limit: 1000,
          userId: newRecord.entryUserId
        }
      })
        .then(({data: {listUserPoolsByUserId: {items}}}) => 
          !items.length &&
          appsync.mutate({
            mutation: UserPool.mutations.create,
            variables: {
              input: {
                userId: newRecord.entryUserId,
                poolId: newRecord.poolId
              }
            }
          })  
        )
    )

const createEntryHistory = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
      appsync.mutate({
        mutation: EntryHistory.mutations.create,
        variables: {
          input: {
            entryId: newRecord.id,
            askingPrice: newRecord.askingPrice ?? undefined,
            salesPrice: newRecord.salesPrice ?? undefined,

            entryHistoryBuyerId: newRecord.entryUserId !== oldRecord.entryUserId ? newRecord.entryUserId ?? undefined : undefined,
            entryHistorySellerId: newRecord.entryUserId !== oldRecord.entryUserId ? oldRecord.entryUserId ?? undefined : newRecord.entryUserId ?? undefined,

            
            type: newRecord.entryUserId !== oldRecord.entryUserId && (!!newRecord.entryUserId && !oldRecord.entryUserId) ? (
              "SOLD"
              ) : !!newRecord.listedForSaleAt && !oldRecord.listedForSaleAt ? ( 
                "LISTED"
              ) : !!oldRecord.listedForSaleAt && !newRecord.listedForSaleAt ? (
                "UNLISTED"
              ) : (
                "MODIFIED"
              )
          }
        }
      })
    )

const updatePoolEntryCount = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => !!newRecord.entryUserId && !oldRecord.entryUserId)
    .map(({newRecord, oldRecord, ...rest}) => 
      dynamodb.updateItem({
        TableName: poolTableName,
        Key: {'id': {'S': newRecord.poolId}},
        UpdateExpression: "ADD #counter :increment",
        ExpressionAttributeNames: {
          '#counter': 'entriesCount'
        },
        ExpressionAttributeValues: {
          ':increment': {'N': '1'}
        }
      })
        .promise()
        .then(() => 
          appsync.mutate({
            mutation: Pool.mutations.update,
            variables: {
              input: {
                id: newRecord.poolId,
                updatedAt: (new Date()).toISOString()
              }
            }
          })
        )
    )

const pipes = [
  updatePoolEntryCount,
  createEntryHistory,
  createUserPoolEntry
];


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
