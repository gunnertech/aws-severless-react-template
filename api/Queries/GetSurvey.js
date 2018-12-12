import gql from 'graphql-tag';

import Survey from '../Fragments/Survey';

export default gql`
  query GetSurvey($id: ID!) {
    getSurvey(id: $id) {
      ...SurveyEntry
    }
  }
  ${Survey.fragments.global}
`;