const awsconfig = require("./config")
const amplifystage = require("./stage");
const AWS = require("aws-sdk");
const fs = require('fs-extra');
const yaml = require('js-yaml');
const shell = require('shelljs');


const awscreds = ({projectName, stage}) =>
  // fs.readFile(`${process.env['HOME']}/.aws/credentials`, 'utf8')
  //   .then(contents => Promise.resolve( 
  //       contents
  //         .split(/( |\n|\r)/)
  //         .find(line => line.includes(`role/${projectName}-${stage}`))
  //         .replace(/role_arn *= */, "")
  //   ))
  Promise.resolve(
    shell.exec(
      `aws configure get role_arn --profile ${projectName}-${stage}developer`
    ).stdout
  )
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

const getTableNames = params =>
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
          .then(({TableNames}) => Promise.resolve(
            TableNames
              .reduce((accumulator, currentValue) => ({
                ...accumulator,
                [currentValue.split('-')[0]]: currentValue
              }), {})
          ))
      )
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
      .catch(console.log)
    )
)

const getUnAuthRoleName = params => (
  awscreds({stage: params.stage, projectName: params.projectName})
    .then(credentials =>
      (new AWS.IAM({
        credentials,
        region: 'us-east-1'
      }))
      .listRoles()
      .promise()
      .then(data => Promise.resolve(data.Roles.find(role => role.RoleName.endsWith('-unauthRole')).RoleName))
      .catch(console.log)
    )
)

const getUserPoolName = params => (
  awscreds({stage: params.stage, projectName: params.projectName})
    .then(credentials =>
      (new AWS.CognitoIdentityServiceProvider({
        credentials,
        region: 'us-east-1'
      }))
      .describeUserPool({UserPoolId: awsconfig.env().aws_user_pools_id})
      .promise()
      .then(({UserPool: {Name}}) => Promise.resolve(Name))
      .catch(console.log)
    )
)

module.exports.custom = () => {
  const doc = yaml.safeLoad(fs.readFileSync('./env.yml', 'utf8'));
  const secrets = yaml.safeLoad(fs.readFileSync('./secrets.yml', 'utf8'));
  const stage = amplifystage.stage();
  return Promise.all([
    getAuthRoleName({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets}),
    getStreams({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets}),
    getUserPoolName({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets}),
    getTableNames({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets}),
    getUnAuthRoleName({stage: stage, projectName: doc[stage].SERVICE, env: doc, secrets: secrets}),
  ])
    .then(arr => Promise.resolve({
      auth_role_name: arr[0],
      streams: arr[1],
      user_pool_name: arr[2],
      tableNames: arr[3],
      unauth_role_name: arr[4],
    }))
}