import AWS from 'aws-sdk';

import {
  sendResponse
} from "./index"


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => (
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