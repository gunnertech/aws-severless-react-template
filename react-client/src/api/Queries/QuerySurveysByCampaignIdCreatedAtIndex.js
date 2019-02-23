import gql from 'graphql-tag';

import Survey from '../Fragments/Survey';

export default gql`
  query QuerySurveysByCampaignIdCreatedAtIndex($campaignId: ID!, $first: Int, $after: String) {
    querySurveysByCampaignIdCreatedAtIndex(campaignId: $campaignId, first: $first, after: $after) {
      items {
        ...SurveyEntry
      }
    }
  }
  ${Survey.fragments.global}
`;