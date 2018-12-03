import gql from 'graphql-tag';

const CampaignTemplate = {
  fragments: {
    global: gql`
      fragment CampaignTemplateEntry on CampaignTemplate {
        __typename
        id
        name
        surveyTemplates {
          items {
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
        }        
      }
    `
  }
}

export default CampaignTemplate;