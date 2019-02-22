import gql from 'graphql-tag';
import Invitation from '../Fragments/Invitation';


export default gql`
  mutation DeleteInvitation(
    $id: ID!
  ) {
    deleteInvitation(input:{
      id: $id
    }) {
      ...InvitationEntry
    }
  }
  ${Invitation.fragments.global}
`;