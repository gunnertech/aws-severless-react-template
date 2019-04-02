import gql from 'graphql-tag';

import Invitation from '../Fragments/Invitation';

export default gql`
  query GetInvitationByCodeIndex($code: String!) {
    getInvitationByCodeIndex(code: $code) {
      ...InvitationEntry
    }
  }
  ${Invitation.fragments.global}
`;