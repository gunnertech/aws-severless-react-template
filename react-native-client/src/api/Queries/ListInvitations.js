import gql from 'graphql-tag';

import Invitation from '../Fragments/Invitation';

export default gql`
  query ListInvitations($first: Int, $after: String) {
    listInvitations(first: $first, after: $after) {
      items {
        ...InvitationEntry
      }
    }
  }
  ${Invitation.fragments.global}
`;