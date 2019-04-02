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

import { Query, compose, graphql } from 'react-apollo';

import moment from 'moment';

import withCurrentUser from '../Hocs/withCurrentUser';

import UpdateResponse from "../api/Mutations/UpdateResponse"
import GetUser from '../api/Queries/GetUser';

const ResponseReview = ({response}) =>
  <span>
    On {moment(response.createdAt).format("M-D-YYYY")}
    <br />
    "{response.reason}"
    {!!response.reviewedAt && (
        <span>
          <br />
          <Query 
            query={GetUser}
            variables={{id: response.reviewerId}}
          >
            {entry => !(entry.data && entry.data.getUser) ? null :
              <span>
                Reviewed {moment(response.reviewedAt).format("M-D-YYYY")} by {entry.data.getUser.email}
              </span>
            }
          </Query>
          {!!response.reviewComment && (
            <span><br />{response.reviewComment}</span>
          )}
        </span>
      )}
  </span>
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
    const { open, onClose, fullScreen, option, surveys, prompt } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{!!option ? option.name : prompt.body}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Review the responses below and tap them to note it has been handled. 
          </DialogContentText>
          <List style={{flex: 1}}>
            {
              surveys
              .map(survey => 
                survey.responses.items
                .filter(response => !option ? !!prompt.options.items.find(option => option.id === response.optionId) : response.optionId === option.id)
                .filter(response => !!response.reason)
                .map(response =>
                  <ListItem key={response.id} button onClick={this._handleToggle(response)}>
                    <ListItemText 
                      primary={`${survey.recipientContact} ${!!survey.recipientIdentifier ? `(${survey.recipientIdentifier||''})` : ``}`}
                      secondary={<ResponseReview response={response} />} 
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        checked={!!response.reviewerId}
                        disabled={!!response.reviewerId}
                        tabIndex={-1}
                        disableRipple
                        onChange={this._handleToggle(response)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                )
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