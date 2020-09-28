import { appsync } from '../clients';
import { handle } from 'handlers/graphql';

// import { accept } from '.';

const resolvers = {
  Query: {

  },
  Mutation: { //event.identity, event.prev.result

  }
}

// eslint-disable-next-line import/prefer-default-export
export const js = handle(resolvers)