import { example, handle } from 'handlers/triggers';

const action = "DELETE";
const pipes = [
  example
];

// eslint-disable-next-line import/prefer-default-export
export const js = async (event, context) => 
  handle(event, context, action, pipes)