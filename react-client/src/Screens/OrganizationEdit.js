import React from 'react'

import { 
  Paper, 
  Button,
  IconButton,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// import withMobileDialog from '@material-ui/core/withMobileDialog';
import { TextField, CircularProgress } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';

import ContentSaveIcon from 'mdi-material-ui/ContentSave';

import Container from '../Components/Container'
import withActionMenu from '../Hocs/withActionMenu'
import withCurrentUser from '../Hocs/withCurrentUser'

import UpdateOrganization from '../api/Mutations/UpdateOrganization'
import Organization from '../api/Fragments/Organization';

const ActionMenu = ({onClick}) => (
  <IconButton
    aria-haspopup="true"
    onClick={onClick}
    color="inherit"
  >
    <ContentSaveIcon />
  </IconButton>
)

const styles = theme => ({
  container: {
    // flexWrap: 'wrap',
    // textAlign: 'left',
    padding: theme.spacing.unit * 2
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class OrganizationEdit extends React.PureComponent {
  state = {
    newName: "",
    saved: false
  }

  _handleChange = (field, event) =>
    this.setState({
      [field]: event.target.value,
      saved: false
    })

  _handleSubmit = ({newName}) =>
    Promise.resolve({
      id: this.props.currentUser.organization.id,
      name: newName
    })
      .then(params =>
        this.props.updateOrganization({ 
          variables: { 
            ...params,
            __typename: "Organization"
          },
          update: (proxy, { data: { updateOrganization } }) =>
            Promise.resolve(
              proxy.writeFragment({ 
                id: updateOrganization.id,
                fragment: Organization.fragments.global,
                fragmentName: 'OrganizationEntry',
                data: {
                  ...updateOrganization,
                  __typename: "Organization"
                }
              })
            )
          ,
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            updateOrganization: { 
              ...this.props.currentUser.organization,
              ...params,
              __typename: "Organization"
            }
          }
        })
      )
      .then(() => this.setState({saved: true}))


  componentDidMount() {
    this.setState({newName: this.props.currentUser.organization.name}, () => this.props.setActionMenu(<ActionMenu onClick={this._handleSubmit.bind(this, this.state)} />))
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        {
          <Paper elevation={2} className={classes.container}>
            <Typography variant="subtitle1">Organization Settings</Typography>
            <form noValidate autoComplete="off">
              <TextField
                id="standard-name"
                label="Name"
                className={classes.textField}
                value={this.state.newName}
                onChange={this._handleChange.bind(this, 'newName')}
                margin="normal"
                fullWidth
              />

              {
                !this.state.newName ? (
                  <CircularProgress className={classes.progress} color="secondary" />
                ) : (
                  <Button variant="contained" onClick={this._handleSubmit.bind(this, {...this.state})} color="primary">
                    Save
                    <ContentSaveIcon className={classes.rightIcon} />
                  </Button>
                )
              }

              {
                this.state.saved && <p>Saved!</p>
              }
            </form>
          </Paper>
        }
      </Container>
    )
  }
}

export default compose(
  withCurrentUser(),
  withStyles(styles),
  withActionMenu(),
  graphql(UpdateOrganization, { name: "updateOrganization" }),
)(OrganizationEdit);

// export default withMobileDialog()(withStyles(styles)(withActionMenu()(OrganizationEdit)));