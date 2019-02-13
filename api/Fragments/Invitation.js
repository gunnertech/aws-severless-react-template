import gql from 'graphql-tag';

const Invitation = {
  fragments: {
    global: gql`
      fragment InvitationEntry on Invitation {
        __typename
        id
        name
        title
        phone
        email
        organizationId
        invitorId
        roleName
        title
        accepted
      }
    `
  }
}

export default Invitation;