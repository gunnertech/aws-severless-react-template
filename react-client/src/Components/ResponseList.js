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

import { compose, graphql } from 'react-apollo';

import moment from 'moment';

import withCurrentUser from '../Hocs/withCurrentUser';

import UpdateResponse from "../api/Mutations/UpdateResponse"

const styles = theme => ({

});

class ResponseList extends React.Component {
  

  _handleToggle = response => () =>
    Promise.resolve({
      reviewerId: this.props.currentUser.id,
      reviewedAt: (new Date()).toISOString(),
      reviewComment: window.prompt("Add a comment (optional)") || undefined
    })
      .then(params =>
        this.props.updateResponse({ 
          variables: { 
            ...response,
            ...params,
            __typename: "Response"
          },
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            updateResponse: { 
              ...response,
              ...params,
              __typename: "Response"
            }
          }
        })    
      )
    

  render() {
    const { open, onClose, fullScreen, option, surveys } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{option.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Review the responses below and tap them to note it has been handled. 
          </DialogContentText>
          <List style={{flex: 1}}>
            {
              surveys.filter(survey => !!survey.responses.items.find(response => response.optionId === option.id).reason).map(survey => 
                <ListItem key={survey.id} button onClick={this._handleToggle(survey.responses.items.find(response => response.optionId === option.id))}>
                  <ListItemText 
                    primary={`${survey.recipientContact} ${!!survey.recipientIdentifier ? `(${survey.recipientIdentifier||''})` : ``}`}
                    secondary={<span>
                      On {moment(survey.responses.items.find(response => response.optionId === option.id).createdAt).format("M-D-YYYY")}
                      <br />
                      "{survey.responses.items.find(response => response.optionId === option.id).reason}"
                      {!!survey.responses.items.find(response => response.optionId === option.id).reviewedAt && (
                          <span>
                            <br />
                            Reviewed on {moment(survey.responses.items.find(response => response.optionId === option.id).reviewedAt).format("M-D-YYYY")}
                            {!!survey.responses.items.find(response => response.optionId === option.id).reviewComment && (
                              <span><br />{survey.responses.items.find(response => response.optionId === option.id).reviewComment}</span>
                            )}
                          </span>
                        )}
                    </span>} 
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      checked={survey.responses.items.find(response => response.optionId === option.id).reviewerId}
                      disabled={survey.responses.items.find(response => response.optionId === option.id).reviewerId}
                      tabIndex={-1}
                      disableRipple
                      onChange={this._handleToggle(survey.responses.items.find(response => response.optionId === option.id))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              )
            }
          </List>
        </DialogContent>
      </Dialog>
    )
  }
}

export default compose(
  withCurrentUser(),
  withStyles(styles),
  graphql(UpdateResponse, { name: "updateResponse" }),
)(ResponseList);