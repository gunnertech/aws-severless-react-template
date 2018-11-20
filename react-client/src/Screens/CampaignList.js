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
// import AccountKeyIcon from 'mdi-material-ui/AccountKey'

import CampaignNew from '../Components/CampaignNew';
import Container from '../Components/Container'
import withActionMenu from '../Hocs/withActionMenu'
import CampaignTemplate from '../Components/CampaignTemplate';

import campaigns from '../Mocks/campaigns';


const panelActions = active => props =>
  <Switch
    onChange={props.onActionClick(props.id)}
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

class CampaignList extends React.PureComponent {
  state = {
    expanded: null,
    showFormModal: false,
    submittingForm: false,
    dcampaigns: [],
    campaigns: campaigns
  }

  _handleSubmit = data =>
    this.setState({
      submittingForm: true,
      campaigns: [
        ...[{
          id: (new Date()).toISOString(), 
          assignedRoles: {items: [{name: data.role}]},
          active: true, 
          ...data
        }], ...this.state.users]
    }, () => setTimeout(() => this.setState({submittingForm: false, showFormModal: false}), 3000))

  _handleMenuClick = () =>
    this.setState({showFormModal: true})

  _handleChange = (panel, event, expanded) =>
    this.setState({
      expanded: expanded ? panel : false,
    })

  _updateCampaignStatus = (campaign, active) =>
    console.log(active)

  componentDidMount() {
    this.props.setActionMenu(<ActionMenu onClick={this._handleMenuClick.bind(this)} />)
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <Container>
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
          !!this.state.campaigns.length ? (
            this.state.campaigns.map(campaign => campaign.campaignTemplate).map(campaignTemplate =>
              <CampaignTemplate 
                expanded={expanded} 
                key={campaignTemplate.id} 
                campaignTemplate={campaignTemplate}
                onSelect={selectedCampaignId => this.setState({selectedCampaignId})}  
                onChange={this._handleChange.bind(this)}
                PanelActions={panelActions(campaignTemplate.active)}
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
      </Container>
    )
  }
}

export default withMobileDialog()(withStyles(styles)(withActionMenu()(CampaignList)));