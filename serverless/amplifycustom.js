const awsconfig = require("./amplifyconfig")
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

const getAdminUserId = params => (
  !(params.secrets[params.stage].ADMIN_USERNAME && params.secrets[params.stage].ADMIN_PASSWORD) ? (
    Promise.resolve(null)
  ) : (
    awscreds({stage: params.stage, projectName: params.projectName})
      .then(credentials =>
        Promise.resolve(new AWS.CognitoIdentityServiceProvider({
          credentials,
          region: 'us-east-1'
        }))
        .then(cognito =>
          cognito
            .listUsers({UserPoolId: awsconfig.env().aws_user_pools_id, Filter: 'email="'+params.secrets[params.stage].ADMIN_USERNAME+'"'})
            .promise()
        )
      )
      .then(data => Promise.resolve(data.Users[0].Username))
  )
)

const getStreams = params =>
  awscreds({stage: params.stage, projectName: params.projectName})
    .then(credentials =>
      Promise.resolve(new AWS.DynamoDB({
        credentials,
        region: 'us-east-1'
      }))
      .then(dynamodb =>
        dynamodb
          .listTables()
          .promise()
          .then(data =>
            Promise.all(data.TableNames.map(tableName => dynamodb.describeTable({TableName: tableName}).promise()))
          )
      )
      .then(tableArray => new Promise(resolve => {
        const tables = {};
        tableArray.forEach(tableData => (tables[tableData.Table.TableName.split("-")[0]] = tableData.Table.LatestStreamArn) );
        resolve(tables);
      }))
    )

const getAuthRoleName = params => (
  awscreds({stage: params.stage, projectName: params.projectName})
    .then(credentials =>
      (new AWS.IAM({
        credentials,
        region: 'us-east-1'
      }))
      .listRoles()
      .promise()
      .then(data => Promise.resolve(data.Roles.find(role => role.RoleName.endsWith('-authRole')).RoleName))
    )
)

module.exports.custom = () => {
  const doc = yaml.safeLoad(fs.readFileSync('./env.yml', 'utf8'));
  const secrets = yaml.safeLoad(fs.readFileSync('./secrets.yml', 'utf8'));
  const stage = amplifystage.stage();
  return Promise.all([
    getAuthRoleName({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets}),
    getStreams({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets}),
    getAdminUserId({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets})
  ])
    .then(arr => Promise.resolve({
      auth_role_name: arr[0],
      streams: arr[1],
      adminUserId: arr[2] || ""
    }))
}