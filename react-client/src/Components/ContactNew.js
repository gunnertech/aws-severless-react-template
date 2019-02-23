import React from 'react';

import MaskedInput from 'react-text-mask';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { TextField, FormControl, InputLabel, Input } from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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

class ContactNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: {
        phone: "",
        email: "",
        name: "",
        contactGroupId: props.contactGroupId
      },
      submitting: false
    }

    this._initialState = {...this.state}
  }

  _handleSubmit = (data, cb) =>
    cb(data)
      .then(result => 
        result && this.setState(this._initialState)
      )

  _handleChange = (field, event) =>
    this.setState({
      contact: {
        ...this.state.contact,
        [field]: event.target.value
      }
    })
  
  render() {
    const { classes, open, submitting, onSubmit, onClose, fullScreen } = this.props;
    const { contact } = this.state;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{`Add Contact`}</DialogTitle>
        <DialogContent>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id="standard-name"
              label="Name"
              className={classes.textField}
              value={contact.name || ""}
              onChange={this._handleChange.bind(this, 'name')}
              margin="normal"
              fullWidth
            />

            <FormControl  className={classes.formControl} fullWidth>
              <InputLabel shrink htmlFor="phone">Phone</InputLabel>
              <Input
                value={(contact.phone||"").replace("+1","")}
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
              value={contact.email}
            />
            {
              submitting ? (
                <CircularProgress className={classes.progress} color="secondary" />
              ) : (
                <DialogActions>
                  <Button onClick={onClose} color="primary">
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={this._handleSubmit.bind(this, contact, onSubmit)} color="primary">
                    Submit
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


export default withStyles(styles)(ContactNew);