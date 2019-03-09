import gql from 'graphql-tag';

import Invitation from '../Fragments/Invitation';

export default gql`
  mutation CreateInvitation(
    $id: ID
    $code: String!
    $name: String!
    $phone: String
    $email: String
    $organizationId: ID!
    $invitorId: ID!
    $roleName: String!
    $title: String
  ) {
    createInvitation(input:{
      id: $id
      name: $name
      code: $code
      title: $title
      phone: $phone
      email: $email
      organizationId: $organizationId
      invitorId: $invitorId
      roleName: $roleName
      title: $title
    }) {
      ...InvitationEntry
    }
  }
  ${Invitation.fragments.global}
`;