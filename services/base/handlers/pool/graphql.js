import { appsync } from '../clients';
import { handle } from 'handlers/graphql';
import UserPool from 'react-shared/api/UserPool';
import Pool from 'react-shared/api/Pool';

const accumulatePoolsByUserIdAndStatus = ({user, provider, status, limit, nextToken, accumulatedPools}) =>
  appsync.query({
    fetchPolicy: "network-only",
    query: UserPool.queries.listByUserId,
    variables: {
      userId: user?.id,
      limit,
      nextToken
    }
  })
  .then(({data: {listUserPoolsByUserId: {nextToken, items} = {}} = {}}) => ({
    nextToken,
    items: items.map(up => up.pool).filter(pool => !status || pool.status === status)
  }))
  .then(({nextToken, items}) => 
    items.length >= limit || !nextToken ? ({
      items: [...(accumulatedPools??[]), ...(items??[])],
      nextToken
    }) : (
      accumulatePoolsByUserIdAndStatus({user, status, limit, nextToken, accumulatedPools: [...(accumulatedPools??[]), ...(items??[])]})
    )
  )

const accumulatePoolsByStatus = ({user, status, limit, nextToken, accumulatedPools}) =>
  appsync.query({
    fetchPolicy: "network-only",
    query: Pool.queries.listByStatus,
    variables: {
      sortDirection: "DESC",
      status,
      limit: 100,
      nextToken,
      withLocales: true,
      withProviders: true
    }
  })
  .then(({data: {listPoolsByStatus: {nextToken, items: pools = []} = {}} = {}}) => console.log("POOL Count", pools.length) || ({
    nextToken,
    items: pools.filter(pool => console.log(JSON.stringify(pool.localePools), JSON.stringify(pool.providerPools)) ||
      pool.localePools.items.map(lp => console.log("LOCALE", lp.localeId) || lp.localeId).includes(user.localeId) &&
      pool.providerPools.items.map(pp => console.log("PROVIDER", pp.providerId) || pp.providerId).includes(user.providerId)
    )
  }))
  .then(({nextToken, items}) => 
    items.length >= limit || !nextToken ? ({
      items: [...(accumulatedPools??[]), ...(items??[])],
      nextToken
    }) : (
      accumulatePoolsByStatus({user, status, limit, nextToken, accumulatedPools: [...(accumulatedPools??[]), ...(items??[])]})
    )
  )

const resolvers = {
  Query: { //event.arguments
    myPools: ({prev: {result: {user, provider}} , arguments: {status, limit, nextToken} }) =>
      accumulatePoolsByUserIdAndStatus({user, provider, status, limit, nextToken})
    ,
    listVisiblePoolsByStatus: ({prev: {result: {user}} , arguments: {status, limit, nextToken} }) =>
      accumulatePoolsByStatus({user, status, limit, nextToken})
  },
  Mutation: { //event.identity, event.prev.result
  
  }
}

// eslint-disable-next-line import/prefer-default-export
export const js = handle(resolvers)