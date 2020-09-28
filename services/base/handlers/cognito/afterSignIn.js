import 'cross-fetch/polyfill';
import { appsync, cognito } from "handlers/clients";
import { getUserRecord, getCognitoRecord } from ".";
import awsmobile from "aws-exports";


const recordSession = ({userId, username}) => 
  cognito
    .adminListUserAuthEvents({Username: username, UserPoolId: awsmobile.aws_user_pools_id, MaxResults: 1})
    .promise()
    .then(({AuthEvents}) => Promise.all(AuthEvents.map(authEvent => 
      appsync.mutate({
        mutation: Session.mutations.create,
        variables: {
          input: {
            userId,
            data: authEvent
          }
        }
      })
    )))
    

const findOrCreateUser = username =>
  getUserRecord(username)
    .then(userRecord => 
      !!userRecord ? (
        userRecord.id
      ) : (
        getCognitoRecord(username)
          .then(User => 
            !User ? Promise.reject("No such user!") : 
            appsync.mutate({
              mutation: User.mutations.create,
              variables: {
                input: {
                  id: username,
                  email: User.Attributes.find(attr => attr.Name === 'email').Value,
                  balance: 0,
                  pendingBalance: 0,
                  promotionalBalance: 0,
                  displayName: `${User.Attributes.find(attr => attr.Name === 'email').Value.split("@")[0]}${Math.floor(1000 + Math.random() * 9000)}`.replace(/\./g, ""),
                  saleDurationPresetMins: 0,
                  bidDurationPresetMins: 0,
                }
              }
            })
            .then(({data: {createUser}}) => createUser.id)
          )
      )  
    )
      .then(id => 
        appsync.query({
          query: User.queries.get,
          fetchPolicy: "network-only",
          variables: {
            id
          }
        })  
      )
      .then(({data: {getUser}}) => getUser)

export const js = async (event, context) =>
  console.log(JSON.stringify(event), JSON.stringify(context)) ||
  // Promise.resolve(event)
  findOrCreateUser(event.userName)
    .then(userId => ({userId, username: event.userName}))
    .then(recordSession)
    .then(() => event)
  