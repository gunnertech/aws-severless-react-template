import React from 'react';

import MaskedInput from 'react-text-mask';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { TextField, FormControl, InputLabel, Input, MenuItem } from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const TextMaskCustom = props =>
  <MaskedInput
    {...props}
    ref={props.inputRef}
    mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
    placeholderChar={'\u2000'}
    showMask
  />

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
    // flexWrap: 'wrap',
    // textAlign: 'left',
    // margin: theme.spacing.unit * 8
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit
  }
});

class UserNew extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      email: "",
      name: "",
      title: "",
      submitting: false
    }

    this._initialState = {...this.state}
  }

  _handleSubmit = (data, cb) =>
    Promise.all([
      this.setState(this._initialState),
      cb(data)
    ])

  _handleChange = (field, event) =>
    this.setState({[field]: event.target.value})

  _resetState = () =>
    this.setState(this._initialState)

  render() {
    const { classes, open, submitting, onSubmit, onClose, fullScreen } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Add a User"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Users may administer surveys but cannot view the dashboard. 
          </DialogContentText>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id="standard-name"
              label="Name"
              className={classes.textField}
              value={this.state.name}
              onChange={this._handleChange.bind(this, 'name')}
              margin="normal"
              fullWidth
            />

            <TextField
              id="standard-title"
              label="Title"
              className={classes.textField}
              value={this.state.title}
              onChange={this._handleChange.bind(this, 'title')}
              margin="normal"
              fullWidth
            />

            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="phone">Phone</InputLabel>
              <Input
                value={this.state.phone}
                onChange={this._handleChange.bind(this, 'phone')}
                id="phone"
                inputComponent={TextMaskCustom}
              />
            </FormControl>

            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              type="email"
              name="email"
              autoComplete="email"
              margin="normal"
              onChange={this._handleChange.bind(this, 'email')}
              fullWidth
              value={this.state.email}
            />

            <TextField
              id="standard-select-role"
              select
              label="Select"
              className={classes.textField}
              value={this.state.role || 'Admin'}
              onChange={this._handleChange.bind(this, 'role')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select the user's role"
              margin="normal"
            >
              {[{value: 'Admin', label: 'Admin'}, {value: 'User', label: 'User'}].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {
              submitting ? (
                <CircularProgress className={classes.progress} color="secondary" />
              ) : (
                <DialogActions>
                  <Button onClick={onClose} color="primary">
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={this._handleSubmit.bind(this, {...this.state}, onSubmit)} color="primary" autoFocus>
                    Add User
                  </Button>
                </DialogActions>
              )
            }
          </form>
        </DialogContent>
      </Dialog>
    )
  }
}


export default withStyles(styles)(UserNew);