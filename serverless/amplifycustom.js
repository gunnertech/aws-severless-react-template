const awsconfig = require("./amplifyconfig");
const amplifystage = require("./amplifystage");
const AWS = require("aws-sdk");
const fs = require('fs-extra');
const yaml = require('js-yaml');


const awscreds = ({projectName, stage}) =>
  fs.readFile(`${process.env['HOME']}/.aws/credentials`, 'utf8')
    .then(contents => Promise.resolve( 
        contents
          .split(/( |\n|\r)/)
          .find(line => line.includes(`role/${projectName}-${stage}`))
          .replace(/role_arn *= */, "")
    ))
    .then(roleArn => Promise.resolve(
      new AWS.STS()
        .assumeRole({
          RoleArn: roleArn.trim(),
          RoleSessionName: `severless-${(new Date()).getTime()}`
        })
        .promise()
        .then(({Credentials}) => Promise.resolve(
          new AWS.Credentials({
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
          })
        ))
    ))


module.exports.custom = () => {
  const doc = yaml.safeLoad(fs.readFileSync('./env.yml', 'utf8'));
  const stage = amplifystage.stage();
  return Promise.all([
    awscreds({stage: stage, projectName: doc[stage].SERVICE})
      .then(credentials =>
        (new AWS.IAM({
          credentials,
          region: 'us-east-1'
        }))
        .listRoles()
        .promise()
        .then(data => Promise.resolve(data.Roles.find(role => role.RoleName.endsWith('-authRole')).RoleName))
      )
  ])
    .then(arr => Promise.resolve({
      auth_role_name: arr[0]
    }))
}