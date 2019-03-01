import gql from 'graphql-tag';
import Response from '../Fragments/Response';


export default gql`
  mutation UpdateResponse(
    $id: ID!
    $reviewedAt: String
    $reviewerId: ID
    $reviewComment: String
  ) {
    updateResponse(input:{
      id: $id
      reviewedAt: $reviewedAt
      reviewerId: $reviewerId
      reviewComment: $reviewComment
    }) {
      ...ResponseEntry
    }
  }
  ${Response.fragments.global}
`;