
import axios from 'axios';

import awsmobile from '../../../amplify/src/aws-exports';

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

const sendResponse = async (
  event,
  context,
  responseStatus,
  responseData,
  physicalResourceId
) => {
  const reason =
    responseStatus == "FAILED"
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
    headers: {
      "Content-Type": "",
      "Content-Length": responseBody.length
    }
  };

  console.info("Response body:\n", responseBody);

  try {
    await axios.put(event.ResponseURL, responseBody, responseOptions);
    console.info("CloudFormationSendResponse Success");
  } catch (error) {
    console.error("CloudFormationSendResponse Error:");
    if (error.response) {
      console.error(error.response);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    console.error(error.config);
    throw new Error("Could not send CloudFormation response");
  }
};

export {
  sendResponse,
  getUserAttributes,
  providerName,
}