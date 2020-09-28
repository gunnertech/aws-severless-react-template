
import fetch from 'node-fetch';

import awsmobile from 'aws-exports';

const sendResponse = (
  event,
  context,
  responseStatus,
  responseData,
  physicalResourceId
) => {
  const reason = responseStatus == "FAILED"
      ? "See the details in CloudWatch Log Stream: " + context.logStreamName
      : undefined;

  const responseBody = JSON.stringify({
    StackId: event.StackId,
    RequestId: event.RequestId,
    Status: responseStatus,
    Reason: reason,
    PhysicalResourceId: physicalResourceId || context.logStreamName,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData
  });

  const responseOptions = {
    "Content-Type": "",
    "Content-Length": responseBody.length
  };

  console.info("Response body:\n", responseBody);

  return fetch(event.ResponseURL, {
      method: "put",
      body: responseBody,
      headers: responseOptions
    }
  )
    .catch(error => {
      if (error.response) {
        console.error(error.response);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
      console.error(error.config);
      Promise.reject("Could not send CloudFormation response");
    })
};

const providerName = `cognito-idp.us-east-1.amazonaws.com/${awsmobile.aws_user_pools_id}:${awsmobile.aws_user_pools_web_client_id}`;

const getUserAttributes = ({username, email, phone}) => {
  const attributes = [
    {Name: "name", Value: "Admin"},
    {Name: "email", Value: (email || username)},
    {Name: "email_verified", Value: "true"}
  ]

  if(!phone) {
    return attributes;
  }

  return [
    ...attributes,
    ...[
      {Name: "phone_number", Value: phone},
      {Name: "phone_number_verified", Value: "true"}
    ]
  ]
}

export {
  getUserAttributes,
  providerName,
  sendResponse,
}