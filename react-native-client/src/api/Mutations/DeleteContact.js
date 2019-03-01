import gql from 'graphql-tag';
import Contact from '../Fragments/Contact';


export default gql`
  mutation DeleteContact(
    $id: ID!
  ) {
    deleteContact(input:{
      id: $id
    }) {
      ...ContactEntry
    }
  }
  ${Contact.fragments.global}
`;