import gql from 'graphql-tag';

// import Survey from './Survey';
// import Option from './Option';

const Response = {
  fragments: {
    global: gql`
      fragment ResponseEntry on Response {
        __typename
        id
        surveyId
        optionId
        reason
        createdAt
      }
    `
  }
}

export default Response;