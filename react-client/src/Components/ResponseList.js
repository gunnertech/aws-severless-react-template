import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({

});

class ResponseList extends React.PureComponent {
  state = {
    checked: [0],
  };

  _handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  }

  render() {
    const { open, onClose, fullScreen } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Unsatisified Responses</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Review the responses below and tap them to note it has been handled. 
          </DialogContentText>
          <List style={{flex: 1}}>
            <ListItem button onClick={this._handleToggle(1)}>
              <ListItemText 
                primary="cody@gunnertech.com (cody)" 
                secondary="Jan 7, 2014: This is the worst experience I've ever head. I will never. Ever. Ever. Ever. Ever. Ever. Ever be using this nurse again. Just so bad!" 
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={this.state.checked.indexOf(1) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button onClick={this._handleToggle(2)}>
              <ListItemText 
                primary="+18609404747 (1243221)" 
                secondary="Jan 7, 2014: Meh" 
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={this.state.checked.indexOf(2) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem button onClick={this._handleToggle(3)}>
              <ListItemText 
                primary="+18609404747 (1243221)" 
                secondary="Jan 7, 2014: Meh" 
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={this.state.checked.indexOf(3) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem button onClick={this._handleToggle(4)}>
              <ListItemText 
                primary="+18609404747 (1243221)" 
                secondary="Jan 7, 2014: Meh" 
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={this.state.checked.indexOf(4) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem button onClick={this._handleToggle(5)}>
              <ListItemText 
                primary="+18609404747 (1243221)" 
                secondary="Jan 7, 2014: Meh" 
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={this.state.checked.indexOf(5) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ResponseList)