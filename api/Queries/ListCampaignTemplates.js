import gql from 'graphql-tag';

import CampaignTemplate from '../Fragments/CampaignTemplate';

export default gql`
  query ListCampaignTemplates($first: Int, $after: String) {
    listCampaignTemplates(first: $first, after: $after) {
      items {
        ...CampaignTemplateEntry
      }
    }
  }
  ${CampaignTemplate.fragments.global}
`;