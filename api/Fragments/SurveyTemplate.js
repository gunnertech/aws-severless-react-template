import gql from 'graphql-tag';

const SurveyTemplate = {
  fragments: {
    global: gql`
      fragment SurveyTemplateEntry on SurveyTemplate {
        __typename
        id
        name
        prompts {
          items {
            id
            body
            options {
              items {
                id
                name
                value
                position
              }
            }
          }
        }
      }
    `
  }
}

export default SurveyTemplate;