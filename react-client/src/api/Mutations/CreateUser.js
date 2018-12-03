import gql from 'graphql-tag';

import User from '../Fragments/User';

export default gql`
  mutation CreateUser(
    $id: ID!
    $name: String
    $title: String
    $phone: String
    $email: String
    $organizationId: ID
    $active: Boolean!
  ) {
    createUser(input:{
      id: $id
      name: $name
      title: $title
      phone: $phone
      email: $email
      organizationId: $organizationId
      active: $active
    }) {
      ...UserEntry
    }
  }
  ${User.fragments.global}
`;