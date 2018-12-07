import gql from 'graphql-tag';

import Invitation from '../Fragments/Invitation';

export default gql`
  query QueryInvitationsByOrganizationIdIdIndex($organizationId: ID!, $first: Int, $after: String) {
    queryInvitationsByOrganizationIdIdIndex(organizationId: $organizationId, first: $first, after: $after) {
      items {
        ...InvitationEntry
      }
    }
  }
  ${Invitation.fragments.global}
`;