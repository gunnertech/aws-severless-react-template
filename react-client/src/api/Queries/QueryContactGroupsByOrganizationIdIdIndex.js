import gql from 'graphql-tag';

import ContactGroup from '../Fragments/ContactGroup';

export default gql`
  query QueryContactGroupsByOrganizationIdIdIndex($organizationId: ID!, $first: Int, $after: String) {
    queryContactGroupsByOrganizationIdIdIndex(organizationId: $organizationId, first: $first, after: $after) {
      items {
        ...ContactGroupEntry
      }
    }
  }
  ${ContactGroup.fragments.global}
`;