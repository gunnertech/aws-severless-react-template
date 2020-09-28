import { dynamodb } from 'handlers/clients';
import { example, handle } from 'handlers/triggers';

const action = "MODIFY";

const pipes = [
  example
];
// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)
