import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import { 
  Button,
  ListItem, 
  ListItemText, 
  IconButton,
  ListItemSecondaryAction
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import AccountPlusIcon from 'mdi-material-ui/AccountPlus';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Mutation, Query, compose, graphql } from 'react-apollo';
import uuid from 'uuid-v4'

import QueryContactsByContactGroupIdIdIndex from "../api/Queries/QueryContactsByContactGroupIdIdIndex"
import CreateContact from "../api/Mutations/CreateContact"
import DeleteContact from "../api/Mutations/DeleteContact"

import ContactNew from "../Components/ContactNew"

import normalizePhoneNumber from '../Util/normalizePhoneNumber'


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  panelDetails: {
    flexFlow: "wrap"
  },
  surveyTemplate: {
    flex: '0 0 100%', 
    display: 'flex',
    marginBottom: theme.spacing.unit * 4
  },
  prompt: {
    display: 'flex', 
    flexDirection: 'row'
  },
  option: {
    flex: 1,
    margin: theme.spacing.unit
  },
  surveyTemplateBody: {
    flex: 1
  },
  promptWrapper: {
    marginBottom: theme.spacing.unit * 2
  }
});

class ContactGroup extends React.Component {
  state = {
    showFormModal: false,
    submittingForm: false,
  }

  _handleSubmit = contactData =>
    new Promise(resolve =>
      this.setState({submittingForm: true}, resolve)
    )
      .then(() =>
        Promise.resolve({
          id: uuid(),
          __typename: "Contact",
          ...contactData
        })
      )
      .then(variables =>
        this.props.createContact({ 
          variables: {
            ...variables,
            phone: normalizePhoneNumber(variables.phone) || undefined,
            email: variables.email || undefined,
          },
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            createContact: variables
          },
          refetchQueries: [{
            query: QueryContactsByContactGroupIdIdIndex,
            variables: { first: 1000, contactGroupId: this.props.contactGroup.id }
          }],
        })
      )
      .then(({data, loading, error}) =>
        new Promise(resolve =>
          this.setState({submittingForm: false, showFormModal: false}, resolve)
        )
      )

  render() {
    const { expanded, onChange, classes, contactGroup } = this.props;
    const { showFormModal, submittingForm } = this.state;
    return (
      <ExpansionPanel 
        expanded={expanded === `panel${contactGroup.id}`} 
        onChange={onChange.bind(null, `panel${contactGroup.id}`)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{contactGroup.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelDetails}>
          {
            showFormModal &&
            <ContactNew 
              contactGroupId={contactGroup.id}
              onClose={() => this.setState({showFormModal: false})} 
              open={showFormModal} 
              onSubmit={this._handleSubmit.bind(this)} 
              submitting={submittingForm} 
            />
          }
          <Query
            query={QueryContactsByContactGroupIdIdIndex}
            variables={{first: 1000, contactGroupId: contactGroup.id}}
          >
            {({loading, error, data: {queryContactsByContactGroupIdIdIndex: {items} = {items: []}} = {}}) => items.map((contact, i) =>
              <ListItem key={contact.id} divider={i !== items.length-1}>
                <ListItemText
                  primary={contact.name} 
                  secondary={`${contact.email} - ${contact.phone}`}
                />
                <Mutation mutation={DeleteContact}>
                  { deleteContact =>
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-haspopup="true"
                        onClick={() => 
                          window.confirm("Delete Conact?") && deleteContact({
                            variables: {
                              id: contact.id,
                            },
                            refetchQueries: [{
                              query: QueryContactsByContactGroupIdIdIndex,
                              variables: { first: 1000, contactGroupId: contactGroup.id }
                            }],
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  }
                </Mutation>
              </ListItem>
            )}
          </Query>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button 
            variant="contained" 
            color="primary" 
            className={classes.button}
            onClick={() => this.setState({showFormModal: true})}
          >
            Add Contact
            <AccountPlusIcon className={classes.rightIcon} />
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(CreateContact, { name: "createContact" }),
)(ContactGroup);