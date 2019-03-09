import React from 'react'

import { withRouter } from 'react-router-dom';

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
import moment from 'moment';
import AccountPlusIcon from 'mdi-material-ui/AccountPlus';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import uuid from 'uuid-v4'
import shortid from 'shortid'

import { Query, compose, graphql, Mutation } from 'react-apollo';

import { Auth } from 'aws-amplify';
import SES from 'aws-sdk/clients/ses';
import SNS from 'aws-sdk/clients/sns';

import normalizePhoneNumber from '../Util/normalizePhoneNumber'

import UserForm from '../Components/UserForm';
import Container from '../Components/Container'

import withActionMenu from '../Hocs/withActionMenu'
import withCurrentUser from '../Hocs/withCurrentUser';

import User from '../api/Fragments/User';


import QueryUsersByOrganizationIdCreatedAtIndex from "../api/Queries/QueryUsersByOrganizationIdCreatedAtIndex"
import QueryInvitationsByOrganizationIdIdIndex from "../api/Queries/QueryInvitationsByOrganizationIdIdIndex"
import UpdateUser from "../api/Mutations/UpdateUser"
import CreateInvitation from '../api/Mutations/CreateInvitation';
import ListInvitations from '../api/Queries/ListInvitations';
import DeleteInvitation from '../api/Mutations/DeleteInvitation'



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
  },
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
});

class UserList extends React.Component {
  state = {
    showFormModal: false,
    editUser: null,
    submittingForm: false,
  }

  _invitationMessage = data =>
    new Promise((resolve, reject) => 
      // eslint-disable-next-line no-undef
      branch.link({
        campaign: 'invitation',
        channel: 'facebook',
        feature: 'download',
        stage: 'new user',
        tags: [ 'tag1', 'tag2', 'tag3' ],
        alias: '',
        data: {
          '$ios_url': data.roleName === 'user' ? !!process.env.REACT_APP_bucket.match(/production/) ? 'https://itunes.apple.com/us/app/simplisurvey/id1449281606' : 'https://testflight.apple.com/join/TjLjqY9z' : `${process.env.REACT_APP_base_url}/dashboard`,
          '$android_url': data.roleName === 'user' ? !!process.env.REACT_APP_bucket.match(/production/) ? 'https://play.google.com/store/apps/details?id=com.gunnertech.simplisurvey' : 'https://play.google.com/apps/internaltest/4700494785583836183' : `${process.env.REACT_APP_base_url}/dashboard`,
          '$desktop_url': data.roleName === 'user' ? `${process.env.REACT_APP_base_url}/surveys/send` : `${process.env.REACT_APP_base_url}/dashboard`,
          '$fallback_url': data.roleName == 'user' ? `${process.env.REACT_APP_base_url}/surveys/send` : `${process.env.REACT_APP_base_url}/dashboard`,
          user: {
            ...data,
          },
          'custom_bool': true,
          'custom_int': Date.now(),
          'custom_string': 'hello',
          '$og_title': 'Title',
          '$og_description': 'Description',
          '$og_image_url':'http://lorempixel.com/400/400'
        }
      }, 
      (err, link) => resolve(link)
      )

    )

  _sendSms = ({phone, roleName, email, link}) =>
    Auth.currentCredentials()
      .then(credentials =>
        new SNS({
          apiVersion: '2010-12-01',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
        .publish({
          Message: `${this.props.currentUser.name} invited you to join SimpliSurvey. Please follow the link to set up your account ${link}  and use ${email} when creating your account.`,
          PhoneNumber: `${phone}`
        })
        .promise()
      )

  _sendEmail = ({email, roleName, link}) =>
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
              'simplisurvey@gunnertech.com',
            ],
            ToAddresses: [
              email
            ]
          },
          Message: { /* required */
            Body: { /* required */
              Html: {
              Charset: "UTF-8",
              Data: `<html>
                        <body>
                          <p>
                            ${this.props.currentUser.name} invited you to join SimpliSurvey. Please follow the link to set up your account ${link}  and use ${email} when creating your account.
                          </p>
                        </body>
                      </html>`
              },
              Text: {
                Charset: "UTF-8",
                Data: `${this.props.currentUser.name} invited you to join SimpliSurvey. Please follow the link to set up your account ${link}  and use ${email} when creating your account.`
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'SimpliSurvey Invitation'
            }
          },
          Source: process.env.REACT_APP_bot_email_adress, /* required */
          ReplyToAddresses: [
            process.env.REACT_APP_bot_email_adress,
          ],
        })
        .promise()
      )

  _validEmail = email =>
    email && !!email.match(/@/)
  
  _validPhone = phone =>
    phone && !!normalizePhoneNumber(phone)

  _inviteUser = (data, invitations) =>
    new Promise((resolve, reject) => 
      !data.user.name ? (
        reject({message: "You must enter a name"})
      ) : this._validEmail(data.user.email) ? (
        !!invitations.find(invitation => invitation.email && invitation.email.toLowerCase() === data.user.email.toLowerCase()) ? (
          reject({message: "There is already an invitation associated with that email address"})
        ) : (
          resolve({
            id: uuid(),
            code: shortid.generate(),
            invitorId: this.props.currentUser.id,
            organizationId: this.props.currentUser.organizationId,
            roleName: data.user.role || null,
            name: data.user.name || null,
            title: data.user.title || null,
            phone: normalizePhoneNumber(data.user.phone) || undefined,
            email: !!data.user.email ? data.user.email.toLowerCase() : undefined
          })
        )
      ) : (
        reject({message: "You must enter a valid email address"})
      )
    )
      .then(params => 
        this._invitationMessage(params)
          .then(url => 
            Promise.all([
              this._validEmail(params.email) && !this._validPhone(params.phone) ? (
                this._sendEmail({...params, link: url})
                  .then(() => params)
                  .catch(args => params)
              ) : (
                Promise.resolve(params)
              ),
              this._validPhone(params.phone) ? (
                this._sendSms({...params, link: url})
                  .then(() => params)
                  .catch(console.log)
              ) : (
                Promise.resolve(params)
              )
            ])
          )
          .then(() => Promise.resolve(params))
      )
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
      .catch(err => window.alert(err.message) || false)

  _handleSubmit = (user, invitations, data) =>
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
          this._inviteUser(data, invitations)
        )
      ))
      .then(result => new Promise(resolve => !result ? (
          this.setState({submittingForm: false, showFormModal: true}, () => resolve(result))
        ) : (
          this.setState({submittingForm: false, showFormModal: false, editUser: null}, () => resolve(result))
        )
      ))

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
            <Query
              variables={{first: 1000}}
              query={ListInvitations}
            >
              {({loading, error, data: {listInvitations: {items} = {items: []}} = {}}) => 
                <UserForm 
                  user={this.state.editUser} 
                  onClose={() => this.setState({showFormModal: false, editUser: null})} 
                  open={this.state.showFormModal} 
                  onSubmit={this._handleSubmit.bind(this, this.state.editUser, items.filter(invitation => !invitation.accepted))} 
                  submitting={this.state.submittingForm} 
                />
              }
            </Query>
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
                      primary={`${user.name || user.id} ${!!user.title ? `(${user.title})` : ''}`} 
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
                entry.data.queryInvitationsByOrganizationIdIdIndex.items.filter(i => !i.accepted).map((invitation, i) =>
                  <ListItem key={invitation.id} divider={i !== entry.data.queryInvitationsByOrganizationIdIdIndex.items.filter(i => !i.accepted).length-1}>
                    <ListItemText
                      primary={`${invitation.name || invitation.id} ${!!invitation.title ? `(${invitation.title})` : ''}`} 
                      secondary={`${invitation.roleName} - Invited ${moment(invitation.updatedAt).format('MMMM Do YYYY')}`}
                    />
                    <Mutation mutation={CreateInvitation}>
                      { createInvitation =>
                        <Mutation mutation={DeleteInvitation}>
                          { deleteInvitation =>
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-haspopup="true"
                                onClick={() => 
                                  window.confirm("Resend this invitation?") && deleteInvitation({
                                    variables: {
                                      id: invitation.id,
                                    }
                                  })
                                  .then(() => this._inviteUser({user: {
                                    email: invitation.email,
                                    role: invitation.roleName,
                                    phone: invitation.phone,
                                    name: invitation.name
                                  }}, []))
                                }
                              >
                                <SendIcon />
                              </IconButton>
                              <br />
                              <IconButton
                                aria-haspopup="true"
                                onClick={() => 
                                  window.confirm("Delete this invitation?") && deleteInvitation({
                                    variables: {
                                      id: invitation.id,
                                    },
                                    onError: console.log,
                                    refetchQueries: [
                                      {
                                        query: QueryInvitationsByOrganizationIdIdIndex,
                                        variables: {organizationId: currentUser.organizationId}
                                      },
                                    ],
                                  })
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          }
                        </Mutation>
                      }
                    </Mutation>
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
)(withRouter(UserList));