import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { TextField, InputLabel } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DialogTitle from '@material-ui/core/DialogTitle';
import FileReaderInput from 'react-file-reader-input';
import normalizePhoneNumber from '../Util/normalizePhoneNumber'

if (!Array.prototype.flat) {
	Object.defineProperties(Array.prototype, {
		flat: {
			configurable: true,
			value: function flat() {
				let depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
				const stack = Array.prototype.slice.call(this);
				const result = [];

				while (depth && stack.length) {
					const next = stack.pop();

					if (Object(next) instanceof Array) {
						--depth;

						Array.prototype.push.apply(stack, next);
					} else {
						result.unshift(next);
					}
				}

				return result.concat(stack);
			},
			writable: true
		},
		flatMap: {
			configurable: true,
			value: function flatMap(callback) {
				return Array.prototype.map.apply(this, arguments).flat();
			},
			writable: true
		}
	});
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  table: {
    minWidth: 500,
  },
  label: {
    marginBottom: theme.spacing.unit * 3,
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
      submitting: false,
      contacts: [],
    }

    this._initialState = {...this.state}
  }

  _handleSubmit = (data, contacts, cb) =>
    cb(data, contacts)
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
  
  _handleFiles = (e, files) =>
    this.setState({
      contacts: files.map(file => 
        file[1].type.toLowerCase() === 'text/csv' ||
        file[1].type.toLowerCase() === 'text/plain' ||
        file[1].type.toLowerCase() === 'application/vnd.ms-excel'
        ? (
          file[0].target.result.replace( /[\n\r]/g, "^~^" ).split("^~^")
            .map(line => line.split(","))
            .map(([name, phone, email]) => ({name, phone: normalizePhoneNumber(phone), email: !!(email||"").match(/@/) ? email : null}))
            .filter(contact => !!contact.name && !!contact.email)
          ) : (
            window.alert(`You can only upload csv files. You uploaded ${file[1].type}`) || []
          )
        )
        .flat(1)
    })
    
    

  render() {
    const { classes, open, submitting, onSubmit, onClose, fullScreen } = this.props;
    const { contactGroup, contacts } = this.state;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Add Group"}</DialogTitle>
        <DialogContent>
          <div className={classes.label}>
            <InputLabel>Optionally load a csv file in the format below</InputLabel>
          </div>

          <FileReaderInput 
            as="binary" 
            id="my-file-input"
            onChange={this._handleFiles}
          >
            <button>Select a File</button>
          </FileReaderInput>

          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact, i) =>
                <TableRow key={i}>
                  <TableCell  component="th" scope="row">
                    {contact.name}
                  </TableCell>
                  <TableCell key={prompt.id}>{contact.phone}</TableCell>
                  <TableCell key={prompt.id}>{contact.email}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
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
                  <Button 
                    variant="contained" 
                    onClick={this._handleSubmit.bind(this, contactGroup, contacts, onSubmit)} 
                    color="primary"
                    disabled={!contactGroup.name}
                  >
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