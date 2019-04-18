// eslint-disable
// this is an auto generated file. This will be overwritten

export const getComment = `query GetComment($id: ID!) {
  getComment(id: $id) {
    id
    createdAt
    updatedAt
    body
  }
}
`;
export const listComments = `query ListComments(
  $filter: ModelCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      updatedAt
      body
    }
    nextToken
  }
}
`;
export const getShudi = `query GetShudi($id: ID!) {
  getShudi(id: $id) {
    id
    commentCount
    createdAt
    updatedAt
    description
    winningOptionNumber
    user {
      id
      createdAt
      updatedAt
      name
      votes {
        nextToken
      }
      shudis {
        nextToken
      }
    }
  }
}
`;
export const listShudis = `query ListShudis(
  $filter: ModelShudiFilterInput
  $limit: Int
  $nextToken: String
) {
  listShudis(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      commentCount
      createdAt
      updatedAt
      description
      winningOptionNumber
      user {
        id
        createdAt
        updatedAt
        name
      }
    }
    nextToken
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    createdAt
    updatedAt
    name
    votes {
      items {
        id
        createdAt
        updatedAt
      }
      nextToken
    }
    shudis {
      items {
        id
        commentCount
        createdAt
        updatedAt
        description
        winningOptionNumber
      }
      nextToken
    }
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      updatedAt
      name
      votes {
        nextToken
      }
      shudis {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getOption = `query GetOption($id: ID!) {
  getOption(id: $id) {
    id
    text
    createdAt
    updatedAt
    imageUrl
    voteCount
    votes {
      items {
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
}
`;
export const listOptions = `query ListOptions(
  $filter: ModelOptionFilterInput
  $limit: Int
  $nextToken: String
) {
  listOptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      text
      createdAt
      updatedAt
      imageUrl
      voteCount
      votes {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getVote = `query GetVote($id: ID!) {
  getVote(id: $id) {
    id
    createdAt
    updatedAt
    option {
      id
      text
      createdAt
      updatedAt
      imageUrl
      voteCount
      votes {
        nextToken
      }
    }
    user {
      id
      createdAt
      updatedAt
      name
      votes {
        nextToken
      }
      shudis {
        nextToken
      }
    }
  }
}
`;
export const listVotes = `query ListVotes(
  $filter: ModelVoteFilterInput
  $limit: Int
  $nextToken: String
) {
  listVotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      updatedAt
      option {
        id
        text
        createdAt
        updatedAt
        imageUrl
        voteCount
      }
      user {
        id
        createdAt
        updatedAt
        name
      }
    }
    nextToken
  }
}
`;
export const searchComments = `query SearchComments(
  $filter: SearchableCommentFilterInput
  $sort: SearchableCommentSortInput
  $limit: Int
  $nextToken: Int
) {
  searchComments(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      createdAt
      updatedAt
      body
    }
    nextToken
  }
}
`;
export const searchShudis = `query SearchShudis(
  $filter: SearchableShudiFilterInput
  $sort: SearchableShudiSortInput
  $limit: Int
  $nextToken: Int
) {
  searchShudis(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      commentCount
      createdAt
      updatedAt
      description
      winningOptionNumber
      user {
        id
        createdAt
        updatedAt
        name
      }
    }
    nextToken
  }
}
`;
