import SES from 'aws-sdk/clients/ses';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-1'});

const emailCSV = (email, csv) =>
  Promise.resolve(
`From: 'SimpliSurvey' <simplisurvey@gunnertech.com>
To: ${email.toLowerCase()}
Subject: Campaign Export
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="NextPart"

--NextPart
Content-Type: text/html; charset=us-ascii
Please see the attached

--NextPart
Content-Type: text/csv;
Content-Disposition: attachment; filename="attachment.csv"

${csv}

--NextPart--
`.replace(/^\s+/g,"")
)
  .then(ses_mail =>
    Auth.currentCredentials()
      .then(credentials => 
        new SES({
          apiVersion: '2010-12-01',
          credentials: Auth.essentialCredentials(credentials)
        })
        .sendRawEmail({
          RawMessage: { Data: new Buffer(ses_mail) },
          Destinations: [ email.toLowerCase() ],
          Source: `'SimpliSurvey' <simplisurvey@gunnertech.com>'`
        })
        .promise()
        .catch(console.log)
      )
  )

export default emailCSV;
