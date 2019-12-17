/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncTodos = `query SyncTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncTodos(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      name
      description
      _version
      _deleted
      _lastChangedAt
    }
    nextToken
    startedAt
  }
}
`;
export const getTodo = `query GetTodo($id: ID!) {
  getTodo(id: $id) {
    id
    name
    description
    _version
    _deleted
    _lastChangedAt
  }
}
`;
export const listTodos = `query ListTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      _version
      _deleted
      _lastChangedAt
    }
    nextToken
    startedAt
  }
}
`;
