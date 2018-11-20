import React from 'react'

import { 
  Paper, 
  Button,
  IconButton,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { TextField, CircularProgress } from '@material-ui/core';

import ContentSaveIcon from 'mdi-material-ui/ContentSave';

import Container from '../Components/Container'
import withActionMenu from '../Hocs/withActionMenu'

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
    name: "Organization #1"
  }

  _handleChange = (field, event) =>
    this.setState({[field]: event.target.value})

  _handleSubmit = data =>
    this.setState({submitting: true}, () => setTimeout(() => this.setState({submitting: false}), 3000))

  componentDidMount() {
    this.props.setActionMenu(<ActionMenu onClick={this._handleSubmit.bind(this, this.state)} />)
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Paper elevation={2} className={classes.container}>
          <Typography variant="subtitle1">Organization Settings</Typography>
          <form noValidate autoComplete="off">
            <TextField
              id="standard-name"
              label="Name"
              className={classes.textField}
              value={this.state.name}
              onChange={this._handleChange.bind(this, 'name')}
              margin="normal"
              fullWidth
            />

            {
              !!this.state.submitting ? (
                <CircularProgress className={classes.progress} color="secondary" />
              ) : (
                <Button variant="contained" onClick={this._handleSubmit.bind(this, {...this.state})} color="primary">
                  Save
                  <ContentSaveIcon className={classes.rightIcon} />
                </Button>
              )
            }
          </form>
        </Paper>
      </Container>
    )
  }
}

export default withMobileDialog()(withStyles(styles)(withActionMenu()(OrganizationEdit)));