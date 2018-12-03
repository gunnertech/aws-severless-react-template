import gql from 'graphql-tag';

import Campaign from '../Fragments/Campaign';
  
export default gql`
  mutation CreateCampaign(
    $id: ID!
    $campaignTemplateId: ID!
    $organizationId: ID!
    $active: Boolean
  ) {
    createCampaign(input:{
      id: $id
      campaignTemplateId: $campaignTemplateId
      organizationId: $organizationId
      active: $active
    }) {
      ...CampaignEntry
    }
  }
  ${Campaign.fragments.global}
`;