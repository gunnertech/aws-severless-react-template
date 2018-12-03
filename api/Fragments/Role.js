import gql from 'graphql-tag';

const Role = {
  fragments: {
    global: gql`
      fragment RoleEntry on Role {
        __typename
        id
        name
      }
    `
  }
}

export default Role;