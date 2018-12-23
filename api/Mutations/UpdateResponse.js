import gql from 'graphql-tag';
import Response from '../Fragments/Response';


export default gql`
  mutation UpdateResponse(
    $id: ID!
    $reviewedAt: String
    $reviewerId: ID
  ) {
    updateResponse(input:{
      id: $id
      reviewedAt: $reviewedAt
      reviewerId: $reviewerId
    }) {
      ...ResponseEntry
    }
  }
  ${Response.fragments.global}
`;