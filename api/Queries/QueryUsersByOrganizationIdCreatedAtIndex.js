import gql from 'graphql-tag';

import User from '../Fragments/User';

export default gql`
  query QueryUsersByOrganizationIdCreatedAtIndex($organizationId: ID!, $first: Int, $after: String) {
    queryUsersByOrganizationIdCreatedAtIndex(organizationId: $organizationId, first: $first, after: $after) {
      items {
        ...UserEntry
      }
    }
  }
  ${User.fragments.global}
`;