import gql from 'graphql-tag';

import SurveyTemplate from './SurveyTemplate';

const CampaignTemplate = {
  fragments: {
    global: gql`
      fragment CampaignTemplateEntry on CampaignTemplate {
        __typename
        id
        name
        surveyTemplates {
          items {
            __typename
            ...SurveyTemplateEntry
          }
        }        
      }
      ${SurveyTemplate.fragments.global}
    `
  }
}

export default CampaignTemplate;