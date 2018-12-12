import gql from 'graphql-tag';

import SurveyTemplate from './SurveyTemplate';

const Survey = {
  fragments: {
    global: gql`
      fragment SurveyEntry on Survey {
        __typename
        id
        userId
        campaignId
        surveyTemplateId
        recipientContact
        recipientIdentifier
        createdAt
        surveyTemplate {
          __typename
          ...SurveyTemplateEntry
        }       
      }
      ${SurveyTemplate.fragments.global}
    `
  }
}

export default Survey;