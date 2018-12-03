import gql from 'graphql-tag';
import Campaign from './Campaign';

const Organization = {
  fragments: {
    global: gql`
      fragment OrganizationEntry on Organization {
        __typename
        id
        name
        campaigns {
          items {
            ...CampaignEntry
          }
        }
      }
      ${Campaign.fragments.global}
    `
  }
}

export default Organization;