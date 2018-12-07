import gql from 'graphql-tag';

import CampaignTemplate from './CampaignTemplate';

const Campaign = {
  fragments: {
    global: gql`
      fragment CampaignEntry on Campaign {
        __typename
        id
        active
        campaignTemplate {
          __typename
          ...CampaignTemplateEntry
        }       
      }
      ${CampaignTemplate.fragments.global}
    `
  }
}

export default Campaign;