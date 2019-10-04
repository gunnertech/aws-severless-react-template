import AWS from 'aws-sdk';

// eslint-disable-next-line import/prefer-default-export
export const js = (event, context) => 
  new AWS.CloudFormation().describeStacks({
    StackName: event.params.stackName
  })
    .promise()
    .then(data => Promise.resolve({
      requestId: event["requestId"],
      status: "success",
      fragment: { LastUpdatedTime: data.Stacks[0].LastUpdatedTime }
    }))
    .catch(error => Promise.resolve({
      requestId: event["requestId"],
      status: "failed",
      fragment: { LastUpdatedTime: "" }
    }))

