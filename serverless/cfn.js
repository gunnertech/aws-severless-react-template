import AWS from 'aws-sdk';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const getStackLastUpdatedTime = (event, context) => 
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


// eslint-disable-next-line import/prefer-default-export
export const sendVerificationEmail = async (event, context) => (
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    new AWS.SES()
      .verifyEmailIdentity({EmailAddress: process.env.SYSTEM_EMAIL_ADDRESS})
      .promise()
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )
)

// eslint-disable-next-line import/prefer-default-export
export const verifyDomain = async (event, context) => (
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    new AWS.SES()
      .verifyDomainIdentity({Domain: process.env.DOMAIN_NAME})
      .promise()
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )
)

// eslint-disable-next-line import/prefer-default-export
export const verifyDkim = async (event, context) => (
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    new AWS.SES()
      .verifyDomainDkim({Domain: process.env.DOMAIN_NAME})
      .promise()
      .then(data => ({
        ChangeBatch: {
         Changes: data.DkimTokens.map(token => ({
          Action: "CREATE", 
          ResourceRecordSet: {
            Name: token + "._domainkey." + process.env.DOMAIN_NAME, 
            ResourceRecords: [
              {
                Value: token + ".dkim.amazonses.com"
              }
            ], 
            TTL: 60, 
            Type: "CNAME"
          }
        })), 
         Comment: "DKIM Tokens"
        }, 
        HostedZoneId: event.ResourceProperties.HostedZoneId
       }))
      .then(() => 
        sendResponse(event, context, "SUCCESS")
      )
      .catch(e => console.log(e) || sendResponse(event, context, "FAILED"))
  )
)

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