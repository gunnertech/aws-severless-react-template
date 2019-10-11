import { sqs, appsync } from './clients';

const queueMessage = ({action, data, queueName}) =>
  sqs.sendMessage({
    MessageBody: JSON.stringify({
      action,
      data
    }),
    QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${queueName}`
  })
    .promise()
    .catch(console.log)


  export {
    queueMessage,
  }