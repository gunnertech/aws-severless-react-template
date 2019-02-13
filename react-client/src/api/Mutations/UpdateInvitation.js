import gql from 'graphql-tag';
import Invitation from '../Fragments/Invitation';


export default gql`
  mutation UpdateInvitation(
    $id: ID!
    $accepted: Boolean
  ) {
    updateInvitation(input:{
      id: $id
      accepted: $accepted
    }) {
      ...InvitationEntry
    }
  }
  ${Invitation.fragments.global}
`;