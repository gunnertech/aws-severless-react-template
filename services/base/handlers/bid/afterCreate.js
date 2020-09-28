import { dynamodb } from 'handlers/clients';
import { handle } from 'handlers/triggers';

const entryTableName = JSON.parse(process.env.TABLES).Entry;

const action = "INSERT";

const updateBidCount = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => 
      dynamodb.updateItem({
        TableName: entryTableName,
        Key: {'id': {'S': newRecord.entryId}},
        UpdateExpression: "ADD #counter :increment",
        ExpressionAttributeNames: {
          '#counter': 'bidCount'
        },
        ExpressionAttributeValues: {
          ':increment': {'N': '1'}
        }
      })
        .promise()
    )

const pipes = [
  updateBidCount
];

// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
