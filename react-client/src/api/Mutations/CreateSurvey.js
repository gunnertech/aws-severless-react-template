import gql from 'graphql-tag';

import Survey from '../Fragments/Survey';
  
export default gql`
  mutation CreateSurvey(
    $id: ID
    $userId: ID!
    $campaignId: ID!
    $surveyTemplateId: ID!
    $recipientContact: String!
    $recipientIdentifier: String
    $createdAt: String
  ) {
    createSurvey(input:{
      id: $id
      userId: $userId
      campaignId: $campaignId
      surveyTemplateId: $surveyTemplateId
      recipientContact: $recipientContact
      recipientIdentifier: $recipientIdentifier
      createdAt: $createdAt
    }) {
      ...SurveyEntry
    }
  }
  ${Survey.fragments.global}
`;