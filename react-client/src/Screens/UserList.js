import React from 'react'

import List from '@material-ui/core/List';
import { 
  ListItem, 
  ListItemText, 
  ListSubheader, 
  Paper, 
  ListItemSecondaryAction, 
  Switch,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import AccountPlusIcon from 'mdi-material-ui/AccountPlus';

import { Query, compose, graphql } from 'react-apollo';

import { Auth } from 'aws-amplify';
import SES from 'aws-sdk/clients/ses';
import SNS from 'aws-sdk/clients/sns';


import UserForm from '../Components/UserForm';
import Container from '../Components/Container'

import withActionMenu from '../Hocs/withActionMenu'
import withCurrentUser from '../Hocs/withCurrentUser';

import User from '../api/Fragments/User';


import QueryUsersByOrganizationIdCreatedAtIndex from "../api/Queries/QueryUsersByOrganizationIdCreatedAtIndex"
import QueryInvitationsByOrganizationIdIdIndex from "../api/Queries/QueryInvitationsByOrganizationIdIdIndex"
import UpdateUser from "../api/Mutations/UpdateUser"
import CreateInvitation from '../api/Mutations/CreateInvitation';


const ActionMenu = ({onClick}) => (
  <IconButton
    aria-haspopup="true"
    onClick={onClick}
    color="inherit"
  >
    <AccountPlusIcon />
  </IconButton>
)

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  container: {
    flexWrap: 'wrap',
    textAlign: 'left',
    margin: theme.spacing.unit * 8
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit
  },
  listItemText: {
    cursor: "pointer"
  }
});

class UserList extends React.Component {
  state = {
    showFormModal: false,
    editUser: null,
    submittingForm: false,
  }

  _sendSms = to =>
    Auth.currentCredentials()
      .then(credentials =>
        new SNS({
          apiVersion: '2010-12-01',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
        .publish({
          Message: `You've been invited to join SimpliSurvey. To get started, follow this link to download the app ${process.env.REACT_APP_base_url}/`,
          PhoneNumber: `+1${to}`
        })
        .promise()
      )

  _sendEmail = to =>
    Auth.currentCredentials()
      .then(credentials =>
        new SES({
          apiVersion: '2010-12-01',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
        .sendEmail({
          Destination: { /* required */
            BccAddresses: [
              'cody@gunnertech.com',
            ],
            ToAddresses: [
              to
            ]
          },
          Message: { /* required */
            Body: { /* required */
              Html: {
              Charset: "UTF-8",
              Data: `<html>
                        <body>
                          You've been invited! Go join
                        </body>
                      </html>`
              },
              Text: {
                Charset: "UTF-8",
                Data: `
                  You've been invited! Go join
                `
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'SimpliSurvey Invitation'
            }
          },
          Source: 'cody@gunnertech.com', /* required */
          ReplyToAddresses: [
            'cody@gunnertech.com',
          ],
        })
        .promise()
      )

  _inviteUser = data => 
    Promise.resolve({
      id: (new Date().getTime()).toString(),
      invitorId: this.props.currentUser.id,
      organizationId: this.props.currentUser.organizationId,
      roleName: data.user.role || null,
      name: data.user.name || null,
      title: data.user.title || null,
      phone: data.user.phone || null,
      email: data.user.email || null
    })
      .then(params =>
        this.props.createInvitation({ 
          variables: { 
            ...params,
            __typename: "Invitation"
          },
          refetchQueries: [{
            query: QueryInvitationsByOrganizationIdIdIndex,
            variables: { organizationId: this.props.currentUser.organizationId }
          }],
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            createInvitation: { 
              ...params,
              __typename: "Invitation"
            }
          }
        })
          .then(() => params)
      )
      .then(params => 
        params.email ? (
          this._sendEmail(params.email)
            .then(() => params)
            .catch(() => params)
         ) : (
           Promise.resolve(params)
         )
      )
      .then(params => 
        params.phone ? (
          this._sendSms(params.phone)
            .then(() => params)
         ) : (
           Promise.resolve(params)
         )
      )

  _handleSubmit = (user, data) =>
    new Promise(resolve => 
      this.setState({submittingForm: true}, resolve)
    )
      .then(() => (
        user ? (
          this._updateUser(user, {
            title: data.user.title || user.title,
            name: data.user.name || user.name
          })
        ) : (
          this._inviteUser(data)
        )
      ))
      .then(() => this.setState({submittingForm: false, showFormModal: false, editUser: null}))

  _handleMenuClick = () =>
    this.setState({showFormModal: true})

  _updateUser = (user, params) =>
    Promise.resolve({
      ...user,
      ...params
    })
      .then(params =>
        this.props.updateUser({ 
          variables: { 
            ...params,
            __typename: "User"
          },
          update: (proxy, { data: { updateUser } }) =>
            Promise.resolve(
              proxy.writeFragment({ 
                id: updateUser.id,
                fragment: User.fragments.global,
                fragmentName: 'UserEntry',
                data: {
                  ...updateUser,
                  __typename: "User"
                }
              })
            )
          ,
          refetchQueries: [
            {
              query: QueryUsersByOrganizationIdCreatedAtIndex,
              variables: { organizationId: this.props.currentUser.organizationId }
            },
            {
              query: QueryInvitationsByOrganizationIdIdIndex,
              variables: { organizationId: this.props.currentUser.organizationId }
            }
          ],
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            updateUser: { 
              ...params,
              __typename: "User"
            }
          }
        })
      )

  componentDidMount() {
    this.props.setActionMenu(<ActionMenu onClick={this._handleMenuClick.bind(this)} />)
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    const { currentUser, classes } = this.props;
    return !currentUser ? "Loading..." : (
      <Container>
        {
          this.state.showFormModal ? (
            <UserForm user={this.state.editUser} onClose={() => this.setState({showFormModal: false, editUser: null})} open={this.state.showFormModal} onSubmit={this._handleSubmit.bind(this, this.state.editUser)} submitting={this.state.submittingForm} />
          ) : (
            null
          )
        }
        <Paper elevation={2}>
          <List subheader={
            <ListSubheader>Manage Users</ListSubheader>
          }>
            <Query
              query={ QueryUsersByOrganizationIdCreatedAtIndex }
              fetchPolicy="cache-and-network"
              variables={{organizationId: currentUser.organizationId }}
            >
              {entry => entry.loading || !((entry.data||{}).queryUsersByOrganizationIdCreatedAtIndex||{}).items ? "Loading Users..." : (
                entry.data.queryUsersByOrganizationIdCreatedAtIndex.items.map((user, i) =>
                  <ListItem key={user.id} divider={i !== entry.data.queryUsersByOrganizationIdCreatedAtIndex.items.length-1}>
                    <ListItemText
                      primaryTypographyProps={{
                        className: classes.listItemText,
                        color: "primary"
                      }}
                      primary={`${user.name || user.id} ${user.title ? `(${user.title})` : ''}`} 
                      secondary={user.assignedRoles.items.map( assignedRole => assignedRole.role.name)[0]}
                      onClick={() => this.setState({showFormModal: true, editUser: user})}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        onChange={this._updateUser.bind(this, user, {active: !user.active})}
                        checked={!!user.active}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>      
                )
              )}
            </Query>
            <Query
              query={ QueryInvitationsByOrganizationIdIdIndex }
              fetchPolicy="cache-and-network"
              variables={{organizationId: currentUser.organizationId }}
            >
              {entry => entry.loading || !((entry.data||{}).queryInvitationsByOrganizationIdIdIndex||{}).items ? "Loading Invitations..." : (
                entry.data.queryInvitationsByOrganizationIdIdIndex.items.map((user, i) =>
                  <ListItem key={user.id} divider={i !== entry.data.queryInvitationsByOrganizationIdIdIndex.items.length-1}>
                    <ListItemText
                      primary={`${user.name || user.id} ${user.title ? `(${user.title})` : ''}`} 
                      secondary={`${user.roleName} - Pending`}
                    />
                  </ListItem>      
                )
              )}
            </Query>
          </List>
        </Paper>
      </Container>
    )
  }
}

export default compose(
  withMobileDialog(),
  withCurrentUser(),
  withStyles(styles),
  withActionMenu(),
  graphql(UpdateUser, { name: "updateUser" }),
  graphql(CreateInvitation, { name: "createInvitation" }),
)(UserList);