// const ServerlessPluginSplitStacks = require('serverless-plugin-split-stacks')

// ServerlessPluginSplitStacks.resolveMigration = function (resource, logicalId) {
//     // console.log("logicalId -->", logicalId, logicalId.indexOf("LogGroup"))

//     if (logicalId.indexOf("ApiGateway") > -1) return
//     if (logicalId.indexOf("LogGroup") > -1) return { destination: "Logs" }
//     if (logicalId.indexOf("LambdaFunction") > -1) return { destination: "Lambda" }
//     if (logicalId.indexOf("Stream") > -1) return { destination: "Stream" }
//     if (logicalId.indexOf("Firehose") > -1) return { destination: "Firehose" }
//     // if (logicalId.indexOf("Queue") > -1) return { destination: "SQS" }
//     if (logicalId.indexOf("AfterCreate") > -1) return { destination: "Triggers" }
//     if (logicalId.indexOf("AfterUpdate") > -1) return { destination: "Triggers" }
//     // if (logicalId.indexOf("Verification") > -1) return { destination: "Verification" }
//     // if (logicalId.indexOf("Amplify") > -1) return { destination: "Amplify" }
//     if (logicalId.indexOf("Policy") > -1) return { destination: "Policies" }
//     if (logicalId.indexOf("Repo") > -1) return { destination: "Repos" }
//     if (logicalId.indexOf("IamRole") > -1) return { destination: "Roles" }
//     if (logicalId.indexOf("Role") > -1) return { destination: "Roles" }
//     // if (logicalId.indexOf("Group") > -1) return { destination: "Group" }
//     if (logicalId.indexOf("LambdaVersion") > -1) return { destination: "Versions" }
//     if (logicalId.indexOf("Permission") > -1) return { destination: "Permissions" }
//     if (logicalId.indexOf("Bucket") > -1) return { destination: "Buckets" }
//     if (logicalId.indexOf("Query") > -1) return { destination: "Queries" }
//     // if (["DbSecret", "DbCluster", "OriginAccessIdentity", "CDN", "DNS"].includes(logicalId)) return { destination: "Misc" }
//     // if (logicalId.indexOf("IamRole") > -1) return { destination: "Roles" }
//     // LambdaVersion
//     console.log(logicalId)
// }

// Custom migration for the serverless-plugin-split-stacks module. We use this
// to produce nested CloudFormation stacks to work around the hard limit of 200
// resources per stack. The default "per function" behaviour of the plugin is
// fine in most cases but results in circular dependencies in some cases, so we
// need to leave Cognito-specific functions in the root stack alongside the
// Cognito resources.
//
// Returning false from this function means the resource in question remains in
// the root stack (created by the Serverless Framework). Returning an object
// means the resource is moved into a nested stack, using the "destination" key
// as part of the stack name. Returning falsy (but not the value false itself)
// results in the default behaviour as defined by the plugin.
//
// See https://github.com/dougmoscrop/serverless-plugin-split-stacks.
// See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html.
const COGNITO_TRIGGERS = [
    'CreateAuthChallenge',
    'CustomMessage',
    'DefineAuthChallenge',
    'PostAuthentication',
    'PostConfirmation',
    'PreAuthentication',
    'PreSignUp',
    'PreTokenGeneration',
    'UserMigration',
    'VerifyAuthChallengeResponse',
  ];
  
  module.exports = (resource, logicalId) => {
    if (COGNITO_TRIGGERS.some((trigger) => logicalId.startsWith(trigger))) {
      return false;
    }
  
    return null;
  };