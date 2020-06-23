import 'cross-fetch/polyfill';
import gql from 'graphql-tag';
import AWS from 'aws-sdk/global'
import SecretsManager from 'aws-sdk/clients/secretsmanager';
import SQS from 'aws-sdk/clients/sqs';
import SES from 'aws-sdk/clients/ses';
import Textract from 'aws-sdk/clients/textract';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import CloudFormation from 'aws-sdk/clients/cloudformation';
import CognitoIdentityServiceProvider  from 'aws-sdk/clients/cognitoidentityserviceprovider';
import IAM  from 'aws-sdk/clients/iam';
import CognitoIdentity  from 'aws-sdk/clients/cognitoidentity';
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import Firehose from  'aws-sdk/clients/firehose';
import S3 from 'aws-sdk/clients/s3';
import SNS from 'aws-sdk/clients/sns';



import awsmobile from '../aws-exports';

const s3 = new S3({
  region: awsmobile.aws_appsync_region
});

const sns = new SNS({
  region: awsmobile.aws_appsync_region
});

const firehose = new Firehose({
 
  region: awsmobile.aws_appsync_region,
});



const textract = new Textract({
  apiVersion: '2018-06-27',
  region: awsmobile.aws_appsync_region,
})

const cognitoidentity = new CognitoIdentity({
  region: awsmobile.aws_appsync_region,
})

const cloudformation = new CloudFormation({
  region: awsmobile.aws_appsync_region
})

const secrets = new SecretsManager({
  region: awsmobile.aws_appsync_region
});

const sqs = new SQS({
  region: awsmobile.aws_appsync_region
});

const ses = new SES({
  region: awsmobile.aws_appsync_region
});

const dynamodb = new DynamoDB({
  apiVersion: '2012-08-10',
  region: awsmobile.aws_appsync_region
});

const cognito = new CognitoIdentityServiceProvider({
  region: awsmobile.aws_appsync_region,
  apiVersion: '2016-04-18'
})

const iam = new IAM({
  region: awsmobile.aws_appsync_region,
})


const appsync = new AWSAppSyncClient({
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  disableOffline: true,
  auth: { type: AUTH_TYPE.AWS_IAM, credentials: AWS.config.credentials },
});

export { 
  appsync, 
  secrets, 
  sqs, 
  ses, 
  dynamodb, 
  cloudformation, 
  cognito, 
  iam, 
  cognitoidentity,
  textract,
  s3,
  firehose,
  sns
};