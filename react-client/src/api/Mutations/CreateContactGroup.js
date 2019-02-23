import gql from 'graphql-tag';

import ContactGroup from '../Fragments/ContactGroup';

export default gql`
  mutation CreateContactGroup(
    $id: ID
    $name: String!
    $organizationId: ID!
    $createdAt: String
    $updatedAt: String
  ) {
    createContactGroup(input:{
      id: $id
      name: $name
      organizationId: $organizationId
      createdAt: $createdAt
      updatedAt: $updatedAt
    }) {
      ...ContactGroupEntry
    }
  }
  ${ContactGroup.fragments.global}
`;