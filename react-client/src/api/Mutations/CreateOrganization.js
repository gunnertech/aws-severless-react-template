import gql from 'graphql-tag';

import Organization from '../Fragments/Organization';


export default gql`
  mutation CreateOrganization(
    $id: ID
    $name: String!
    $logoUrl: String
    $ownerId: ID
  ) {
    createOrganization(input:{
      id: $id
      name: $name
      logoUrl: $logoUrl
      ownerId: $ownerId
    }) {
      __typename
      ...OrganizationEntry
    }
  }
  ${Organization.fragments.global}
`;