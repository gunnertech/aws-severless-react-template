import { dynamodb } from "../clients"
import DynamoDB from 'aws-sdk/clients/dynamodb';

const tableName = JSON.parse(process.env.TABLES).User

const getByEmail = email =>
  dynamodb.query({
    TableName: tableName,
    IndexName: "ByEmail",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: DynamoDB.Converter.marshall({
      ":email": email
    })
  })
    .promise()
    .then(resp => 
      resp.Items.map(DynamoDB.Converter.unmarshall)[0]  
    )


export {
  getByEmail,
  tableName
}