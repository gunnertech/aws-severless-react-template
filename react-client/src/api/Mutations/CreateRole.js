import gql from 'graphql-tag';

import Role from '../Fragments/Role';

export default gql`
  mutation CreateRole(
    $id: ID
    $name: String!
  ) {
    createRole(input:{
      id: $id
      name: $name
    }) {
      ...RoleEntry
    }
  }
  ${Role.fragments.global}
`;