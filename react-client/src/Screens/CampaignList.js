import React from 'react'

import { 
  IconButton,
  Button,
  Typography,
  Switch
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import FilePlusIcon from 'mdi-material-ui/FilePlus';

import { Query, compose, graphql } from 'react-apollo';

import CampaignNew from '../Components/CampaignNew';
import Container from '../Components/Container'
import withActionMenu from '../Hocs/withActionMenu'
import CampaignTemplate from '../Components/CampaignTemplate';
import withCurrentUser from '../Hocs/withCurrentUser';

import CreateCampaign from "../api/Mutations/CreateCampaign"
import UpdateCampaign from "../api/Mutations/UpdateCampaign"
import GetUser from "../api/Queries/GetUser"
import Campaign from '../api/Fragments/Campaign';


const panelActions = active => props =>
  <Switch
    onChange={props.onActionClick.bind(null, props.id)}
    checked={active}
  />

const ActionMenu = ({onClick}) => (
  <IconButton
    aria-haspopup="true"
    onClick={onClick}
    color="inherit"
  >
    <FilePlusIcon />
  </IconButton>
)

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
    flexWrap: 'wrap',
    textAlign: 'left',
    margin: theme.spacing.unit * 8
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit
  }
});

class CampaignList extends React.Component {
  state = {
    expanded: null,
    showFormModal: false,
    submittingForm: false,
  }

  _handleSubmit = ({selectedCampaignId}) =>
    new Promise(resolve =>
      this.setState({submittingForm: true}, resolve)
    )
      .then(() =>
        Promise.resolve({
          id: (new Date().getTime()).toString(),
          campaignTemplateId: selectedCampaignId,
          organizationId: this.props.currentUser.organization.id,
          active: true
        })
      )
      .then(params => 
        this.props.createCampaign({ 
          variables: { 
            ...params,
            __typename: "Campaign"
          },
          update: (proxy, { data: { createCampaign } }) =>
            Promise.resolve(
              proxy.writeQuery({ 
                query: GetUser, 
                variables: { id: this.props.currentUser.id },
                data: {
                  getUser: {
                    ...this.props.currentUser,
                    organization: {
                      ...this.props.currentUser.organization,
                      campaigns: {
                        ...this.props.currentUser.organization.campaigns,
                        items: [
                          ...this.props.currentUser.organization.campaigns.items,
                          createCampaign
                        ]
                      }
                    }
                  }
                }
              })
            )
          ,
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            createCampaign: { 
              ...params,
              __typename: "Campaign"
            }
          }
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
  
  _handleSwitch = (campaignId, event, active) =>
    Promise.resolve(
      this.props.currentUser.organization.campaigns.items.find(campaign => campaign.id === campaignId)
    )
      .then(cachedCampaign =>
        Promise.resolve([cachedCampaign, {
          id: campaignId,
          active
        }])
      )
      .then(([cachedCampaign, params]) =>
        this.props.updateCampaign({ 
          variables: { 
            ...params,
            __typename: "Campaign"
          },
          update: (proxy, { data: { updateCampaign } }) =>
            Promise.resolve(
              proxy.writeFragment({ 
                id: updateCampaign.id,
                fragment: Campaign.fragments.global,
                fragmentName: 'CampaignEntry',
                data: {
                  ...updateCampaign,
                  __typename: "Campaign"
                }
              })
            )
          ,
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            updateCampaign: { 
              ...cachedCampaign,
              ...params,
              __typename: "Campaign"
            }
          }
        })
      )
    


  componentDidMount() {
    this.props.setActionMenu(<ActionMenu onClick={this._handleMenuClick.bind(this)} />)

    if(!this.props.currentUser.organization.campaigns.items.length) {
      this.setState({showFormModal: true})
    }
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    const { classes, currentUser } = this.props;
    const { expanded } = this.state;
    return (
      <Container>
        <Query
          query={ GetUser }
          fetchPolicy="cache-and-network"
          variables={{id: currentUser.id}}
        >
          {entry => entry.loading || !entry.data.getUser ? "Loading..." :
            <div>
              {
                this.state.showFormModal ? (
                  <CampaignNew 
                    onClose={() => this.setState({showFormModal: false})} 
                    open={this.state.showFormModal} 
                    onSubmit={this._handleSubmit.bind(this)} 
                    submitting={this.state.submittingForm} 
                  />
                ) : (
                  null
                )
              }
              <Typography variant="h6">Manage Campaigns</Typography>
              {
                !!entry.data.getUser.organization.campaigns.items.length ? (
                  entry.data.getUser.organization.campaigns.items.map((campaign, i) =>
                    <CampaignTemplate 
                      expanded={expanded} 
                      key={`${campaign.id}-${i}`} 
                      campaignTemplate={campaign.campaignTemplate}
                      campaign={campaign}
                      onSelect={this._handleSwitch.bind(this)}  
                      onChange={this._handleChange.bind(this)}
                      PanelActions={panelActions(campaign.active)}
                    />      
                  )
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.button}
                    onClick={this._handleMenuClick.bind(this)}  
                  >
                    Add Your First Campaign
                    <FilePlusIcon className={classes.rightIcon} />
                  </Button>
                )
              }
            </div>
          }
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
  graphql(CreateCampaign, { name: "createCampaign" }),
  graphql(UpdateCampaign, { name: "updateCampaign" }),
)(CampaignList);