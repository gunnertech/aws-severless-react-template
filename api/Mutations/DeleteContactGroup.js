import gql from 'graphql-tag';
import ContactGroup from '../Fragments/ContactGroup';


export default gql`
  mutation DeleteContactGroup(
    $id: ID!
  ) {
    deleteContactGroup(input:{
      id: $id
    }) {
      ...ContactGroupEntry
    }
  }
  ${ContactGroup.fragments.global}
`;