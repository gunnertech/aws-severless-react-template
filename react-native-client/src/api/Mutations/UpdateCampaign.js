import gql from 'graphql-tag';
import Campaign from '../Fragments/Campaign';


export default gql`
  mutation UpdateCampaign(
    $id: ID!
    $active: Boolean
  ) {
    updateCampaign(input:{
      id: $id
      active: $active
    }) {
      ...CampaignEntry
    }
  }
  ${Campaign.fragments.global}
`;