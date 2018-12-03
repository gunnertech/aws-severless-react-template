import gql from 'graphql-tag';
import Organization from './Organization';

const User = {
  fragments: {
    global: gql`
      fragment UserEntry on User {
        __typename
        id
        title
        phone
        email
        active
        createdAt
        updatedAt
        organizationId
        organization {
          __typename
          ...OrganizationEntry
        }
        assignedRoles {
          items {
            id
          }
        }
      }
      ${Organization.fragments.global}
    `
  }
}

export default User;