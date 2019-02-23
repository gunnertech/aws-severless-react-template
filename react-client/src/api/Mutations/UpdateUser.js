import gql from 'graphql-tag';
import User from '../Fragments/User';


export default gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $title: String
    $organizationId: ID
    $active: Boolean
  ) {
    updateUser(input:{
      id: $id
      name: $name
      title: $title
      organizationId: $organizationId
      active: $active
    }) {
      ...UserEntry
    }
  }
  ${User.fragments.global}
`;