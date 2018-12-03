import gql from 'graphql-tag';

import Role from '../Fragments/Role';

export default gql`
  query QueryRolesByNameIdIndex($name: String!, $first: Int, $after: String) {
    queryRolesByNameIdIndex(name: $name, first: $first, after: $after) {
      items {
        ...RoleEntry
      }
    }
  }
  ${Role.fragments.global}
`;