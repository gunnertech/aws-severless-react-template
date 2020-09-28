import { ses } from '../clients'

import {
  sendResponse
} from "./index"


// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => (
  event.RequestType === "Delete" ? (
    sendResponse(event, context, "SUCCESS")
  ) : (
    ses
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