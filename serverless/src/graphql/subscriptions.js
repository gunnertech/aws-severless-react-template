// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateComment = `subscription OnCreateComment {
  onCreateComment {
    id
    createdAt
    updatedAt
    body
  }
}
`;
export const onUpdateComment = `subscription OnUpdateComment {
  onUpdateComment {
    id
    createdAt
    updatedAt
    body
  }
}
`;
export const onDeleteComment = `subscription OnDeleteComment {
  onDeleteComment {
    id
    createdAt
    updatedAt
    body
  }
}
`;
export const onCreateShudi = `subscription OnCreateShudi {
  onCreateShudi {
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
export const onUpdateShudi = `subscription OnUpdateShudi {
  onUpdateShudi {
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
export const onDeleteShudi = `subscription OnDeleteShudi {
  onDeleteShudi {
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
export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
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
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
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
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
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
export const onCreateOption = `subscription OnCreateOption {
  onCreateOption {
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
export const onUpdateOption = `subscription OnUpdateOption {
  onUpdateOption {
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
export const onDeleteOption = `subscription OnDeleteOption {
  onDeleteOption {
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
export const onCreateVote = `subscription OnCreateVote {
  onCreateVote {
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
export const onUpdateVote = `subscription OnUpdateVote {
  onUpdateVote {
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
export const onDeleteVote = `subscription OnDeleteVote {
  onDeleteVote {
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
