import gql from 'graphql-tag';

import User from '../Fragments/User';

export default gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      ...UserEntry
    }
  }
  ${User.fragments.global}
`;