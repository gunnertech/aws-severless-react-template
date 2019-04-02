import gql from 'graphql-tag';

const User = {
  fragments: {
    global: gql`
      fragment UserEntry on User {
        __typename
        id
        name
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
            role {
              id
              name
            }
          }
        }
      }
    `
  }
}

export default User;