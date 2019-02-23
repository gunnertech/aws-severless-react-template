import React from 'react'

import { 
  IconButton,
  Button,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import AccountMultiplePlus from 'mdi-material-ui/AccountMultiplePlus';


import uuid from 'uuid-v4'

import { Query, compose, graphql } from 'react-apollo';

import Container from '../Components/Container';
import ContactGroupNew from '../Components/ContactGroupNew'
import ContactGroup from '../Components/ContactGroup'

import withActionMenu from '../Hocs/withActionMenu';
import withCurrentUser from '../Hocs/withCurrentUser';

import CreateContactGroup from "../api/Mutations/CreateContactGroup"
import QueryContactGroupsByOrganizationIdIdIndex from "../api/Queries/QueryContactGroupsByOrganizationIdIdIndex"


const ActionMenu = ({onClick}) => (
  <IconButton
    aria-haspopup="true"
    onClick={onClick}
    color="inherit"
  >
    <AccountMultiplePlus />
  </IconButton>
)

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class ContactGroupList extends React.Component {
  state = {
    expanded: null,
    showFormModal: false,
    submittingForm: false,
  }

  _handleSubmit = contactGroupData =>
    new Promise(resolve =>
      this.setState({submittingForm: true}, resolve)
    )
      .then(() =>
        Promise.resolve({
          id: uuid(),
          __typename: "ContactGroup",
          ...contactGroupData
        })
      )
      .then(variables =>
        this.props.createContactGroup({ 
          variables,
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            createContactGroup: variables
          },
          refetchQueries: [{
            query: QueryContactGroupsByOrganizationIdIdIndex,
            variables: { organizationId: this.props.currentUser.organizationId, first: 1000 }
          }],
        })
      )
      .then(({data, loading, error}) =>
        new Promise(resolve =>
          this.setState({submittingForm: false, showFormModal: false}, resolve)
        )
      )

  _handleMenuClick = () =>
    this.setState({showFormModal: true})

  _handleChange = (panel, event, expanded) =>
    this.setState({
      expanded: expanded ? panel : false,
    })
  
    


  componentDidMount() {
    this.props.setActionMenu(<ActionMenu onClick={this._handleMenuClick.bind(this)} />)
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    const { classes, currentUser } = this.props;
    const { expanded, showFormModal, submittingForm } = this.state;
    return (
      <Container>
        {
          showFormModal &&
          <ContactGroupNew 
            organizationId={currentUser.organizationId}
            onClose={() => this.setState({showFormModal: false})} 
            open={showFormModal} 
            onSubmit={this._handleSubmit.bind(this)} 
            submitting={submittingForm} 
          />
        }

        <Typography variant="h6">Contact Groups</Typography>

        <Query
          query={QueryContactGroupsByOrganizationIdIdIndex}
          variables={{first: 1000, organizationId: currentUser.organizationId}}
        >
          {({loading, error, data: {queryContactGroupsByOrganizationIdIdIndex: {items} = {items: []}} = {}}) => (
            !items.length ? (
              <Button 
                variant="contained" 
                color="primary" 
                className={classes.button}
                onClick={this._handleMenuClick.bind(this)}  
              >
                Add Your First Group
                <AccountMultiplePlus className={classes.rightIcon} />
              </Button>
            ) : (
              items.map(contactGroup =>
                <ContactGroup 
                  contactGroup={contactGroup}
                  expanded={expanded} 
                  key={`${contactGroup.id}`}
                  onChange={this._handleChange.bind(this)} 
                />
              )
            )
          )}
        </Query>
      </Container>
    )
  }
}

export default compose(
  withCurrentUser(),
  withMobileDialog(),
  withStyles(styles),
  withActionMenu(),
  graphql(CreateContactGroup, { name: "createContactGroup" }),
)(ContactGroupList);