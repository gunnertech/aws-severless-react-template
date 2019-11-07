import { sqs, appsync } from './clients';

const queueErrorMessage = ({action, data}) =>
  sqs.sendMessage({
    MessageBody: JSON.stringify({
      action,
      data
    }),
    QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${process.env.ERROR_QUEUE_NAME}`
  })
    .promise()
    .catch(console.log)


  export {
    queueErrorMessage,
  }