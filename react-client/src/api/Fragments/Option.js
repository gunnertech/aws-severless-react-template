import gql from 'graphql-tag';


const Option = {
  fragments: {
    global: gql`
      fragment OptionEntry on Option {
        __typename
        id
        value
        name
        iconUrl
        promptId
        position
      }
    `
  }
}

export default Option;