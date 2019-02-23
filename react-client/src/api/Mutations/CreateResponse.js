import gql from 'graphql-tag';

import Response from '../Fragments/Response';
  
export default gql`
  mutation CreateResponse(
    $id: ID
    $optionId: ID!
    $surveyId: ID!
    $reason: String
    $createdAt: String
  ) {
    createResponse(input:{
      id: $id
      optionId: $optionId
      surveyId: $surveyId
      reason: $reason
      createdAt: $createdAt
    }) {
      ...ResponseEntry
    }
  }
  ${Response.fragments.global}
`;