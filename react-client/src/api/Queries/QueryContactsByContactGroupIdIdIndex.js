import gql from 'graphql-tag';

import Contact from '../Fragments/Contact';

export default gql`
  query QueryContactsByContactGroupIdIdIndex($contactGroupId: ID!, $first: Int, $after: String) {
    queryContactsByContactGroupIdIdIndex(contactGroupId: $contactGroupId, first: $first, after: $after) {
      items {
        ...ContactEntry
      }
    }
  }
  ${Contact.fragments.global}
`;