import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';


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

class ContactGroupNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contactGroup: {
        name: "",
        organizationId: props.organizationId,
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
      contactGroup: {
        ...this.state.contactGroup,
        [field]: event.target.value
      }
    })
  
  render() {
    const { classes, open, submitting, onSubmit, onClose, fullScreen } = this.props;
    const { contactGroup } = this.state;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Add Group"}</DialogTitle>
        <DialogContent>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id="standard-name"
              label="Name"
              className={classes.textField}
              value={contactGroup.name || ""}
              onChange={this._handleChange.bind(this, 'name')}
              margin="normal"
              fullWidth
            />
            {
              submitting ? (
                <CircularProgress className={classes.progress} color="secondary" />
              ) : (
                <DialogActions>
                  <Button onClick={onClose} color="primary">
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={this._handleSubmit.bind(this, contactGroup, onSubmit)} color="primary">
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


export default withStyles(styles)(ContactGroupNew);