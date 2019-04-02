import gql from 'graphql-tag';

import Contact from '../Fragments/Contact';

export default gql`
  mutation CreateContact(
    $id: ID
    $name: String!
    $phone: String
    $email: String
    $contactGroupId: ID!
    $createdAt: String
    $updatedAt: String
  ) {
    createContact(input:{
      id: $id
      name: $name
      phone: $phone
      email: $email
      contactGroupId: $contactGroupId
      createdAt: $createdAt
      updatedAt: $updatedAt
    }) {
      ...ContactEntry
    }
  }
  ${Contact.fragments.global}
`;