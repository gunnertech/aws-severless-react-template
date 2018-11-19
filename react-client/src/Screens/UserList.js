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
  // Menu,
  // MenuItem 
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import AccountPlusIcon from 'mdi-material-ui/AccountPlus';
// import AccountKeyIcon from 'mdi-material-ui/AccountKey'

import UserNew from '../Components/UserNew';
import Container from '../Components/Container'
import withActionMenu from '../Hocs/withActionMenu'

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
  }
});

class UserList extends React.PureComponent {
  state = {
    showFormModal: false,
    submittingForm: false,
    users: [
      {
        id: 'codyswann',
        name: 'Cody Swann',
        title: "CEO",
        phone: "1860940474",
        email: "cody@gunnertech.com",
        organizationId: "1",
        createdAt: (new Date()).toISOString(),
        updatedAt: (new Date()).toISOString(),
        active: true,
        assignedRoles: {
          items: [{
            name: "Admin"
          }]
        }
      },
      {
        id: 'user',
        name: 'Jane Doe',
        title: "CEO",
        phone: "1860940474",
        email: "cody@gunnertech.com",
        organizationId: "1",
        createdAt: (new Date()).toISOString(),
        updatedAt: (new Date()).toISOString(),
        active: false,
        assignedRoles: {
          items: [{
            name: "User"
          }]
        }
      }
    ]
  }

  _handleSubmit = data =>
    this.setState({
      submittingForm: true,
      users: [
        ...[{
          id: (new Date()).toISOString(), 
          assignedRoles: {items: [{name: data.role}]},
          active: true, 
          ...data
        }], ...this.state.users]
    }, () => setTimeout(() => this.setState({submittingForm: false, showFormModal: false}), 3000))

  _handleMenuClick = () =>
    this.setState({showFormModal: true})

  _updateUserStatus = (user, active) =>
    console.log(active)

  componentDidMount() {
    this.props.setActionMenu(<ActionMenu onClick={this._handleMenuClick.bind(this)} />)
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    return (
      <Container>
        {
          this.state.showFormModal ? (
            <UserNew onClose={() => this.setState({showFormModal: false})} open={this.state.showFormModal} onSubmit={this._handleSubmit.bind(this)} submitting={this.state.submittingForm} />
          ) : (
            null
          )
        }
        <Paper elevation={2}>
          <List subheader={
            <ListSubheader>Manage Users</ListSubheader>
          }>
            {
              this.state.users.map(user =>
                <ListItem key={user.id}>
                  <ListItemText 
                    primary={user.name} 
                    secondary={user.assignedRoles.items.map( role => role.name).join(",")}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        onChange={this._updateUserStatus.bind(this, user, !user.active)}
                        checked={!!user.active}
                      />
                    </ListItemSecondaryAction>
                </ListItem>      
              )
            }
          </List>
        </Paper>
      </Container>
    )
  }
}

export default withMobileDialog()(withStyles(styles)(withActionMenu()(UserList)));