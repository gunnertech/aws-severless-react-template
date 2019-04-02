import gql from 'graphql-tag';

const Contact = {
  fragments: {
    global: gql`
      fragment ContactEntry on Contact {
        __typename
        id
        name
        phone
        email
        contactGroupId
        createdAt
        updatedAt
      }
    `
  }
}

export default Contact;