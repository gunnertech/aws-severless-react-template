import gql from 'graphql-tag';

import SurveyTemplate from './SurveyTemplate';
// import User from './User';
import Response from './Response';

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
        responses {
          items {
            __typename
            ...ResponseEntry
          }
        }
      }
      ${SurveyTemplate.fragments.global}
      ${Response.fragments.global}
    `
  }
}

export default Survey;