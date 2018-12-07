import gql from 'graphql-tag';

import Role from '../Fragments/Role';
import User from '../Fragments/User';

export default gql`
  mutation CreateAssignedRole(
    $id: ID
    $userId: ID!
    $roleId: ID!
  ) {
    createAssignedRole(input:{
      id: $id
      userId: $userId
      roleId: $roleId
    }) {
      user {
        ...UserEntry
      }
      role {
        ...RoleEntry
      }
    }
  }
  ${User.fragments.global}
  ${Role.fragments.global}
`;