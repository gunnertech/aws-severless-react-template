import gql from 'graphql-tag';


export default gql`
  mutation UpdateOrganization(
    $id: ID!
    $name: String
  ) {
    updateOrganization(input:{
      id: $id
      name: $name
    }) {
      id
      name
    }
  }
`;