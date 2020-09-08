import 'cross-fetch/polyfill';
import DynamoDB from 'aws-sdk/clients/dynamodb';


const example = recordMaps => 
  recordMaps
    .filter(({newRecord, oldRecord, ...rest}) => true)
    .map(({newRecord, oldRecord, ...rest}) => Promise.resolve(null))


const recordFilter = ({event, action}) =>
  console.log("EVENT", JSON.stringify(event)) ||
  console.log("ACTION", action) ||
  event.Records
    .filter(record =>
      record.eventName === action
    )
    .map(record => ({
      ...record,
      newRecord: DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
      oldRecord: DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
    }))

const handle = (event, context, action, pipes) =>
  console.log("PIPES", JSON.stringify(pipes)) ||
  console.log("recordFilter", JSON.stringify(recordFilter({event, action}))) ||
  (new Promise((resolve, reject) =>
    Promise.resolve(recordFilter({event, action}))
      .then(recordMaps => 
        Promise.all(pipes.map(pipe => pipe(recordMaps)).flat(100))  
      )
      .then(resolve)
      .catch(err => 
        console.log("ERROR:", JSON.stringify(err)) || 
        reject(err)
      )
  ))


export {
  example,
  recordFilter,
  handle
}