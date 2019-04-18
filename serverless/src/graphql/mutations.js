// eslint-disable
// this is an auto generated file. This will be overwritten

export const createComment = `mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    createdAt
    updatedAt
    body
  }
}
`;
export const updateComment = `mutation UpdateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    id
    createdAt
    updatedAt
    body
  }
}
`;
export const deleteComment = `mutation DeleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input) {
    id
    createdAt
    updatedAt
    body
  }
}
`;
export const createShudi = `mutation CreateShudi($input: CreateShudiInput!) {
  createShudi(input: $input) {
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
export const updateShudi = `mutation UpdateShudi($input: UpdateShudiInput!) {
  updateShudi(input: $input) {
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
export const deleteShudi = `mutation DeleteShudi($input: DeleteShudiInput!) {
  deleteShudi(input: $input) {
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
export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
export const createOption = `mutation CreateOption($input: CreateOptionInput!) {
  createOption(input: $input) {
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
export const updateOption = `mutation UpdateOption($input: UpdateOptionInput!) {
  updateOption(input: $input) {
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
export const deleteOption = `mutation DeleteOption($input: DeleteOptionInput!) {
  deleteOption(input: $input) {
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
export const createVote = `mutation CreateVote($input: CreateVoteInput!) {
  createVote(input: $input) {
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
export const updateVote = `mutation UpdateVote($input: UpdateVoteInput!) {
  updateVote(input: $input) {
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
export const deleteVote = `mutation DeleteVote($input: DeleteVoteInput!) {
  deleteVote(input: $input) {
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
