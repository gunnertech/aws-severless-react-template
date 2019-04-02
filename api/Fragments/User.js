import gql from 'graphql-tag';

const User = {
  fragments: {
    global: gql`
      fragment UserEntry on User {
        __typename
        id
        name
        phone
        email
        createdAt
        updatedAt
      }
    `
  }
}

export default User;