import gql from 'graphql-tag';

const ContactGroup = {
  fragments: {
    global: gql`
      fragment ContactGroupEntry on ContactGroup {
        __typename
        id
        name
        organizationId
        createdAt
        updatedAt
      }
    `
  }
}

export default ContactGroup;