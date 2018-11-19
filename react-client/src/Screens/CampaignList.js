import React from 'react'

import List from '@material-ui/core/List';
import { 
  ListItem, 
  ListItemText, 
  ListSubheader, 
  Paper, 
  ListItemSecondaryAction, 
  Switch,
  IconButton,
  Button
  // Menu,
  // MenuItem 
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';


import FilePlusIcon from 'mdi-material-ui/FilePlus';
// import AccountKeyIcon from 'mdi-material-ui/AccountKey'

import CampaignNew from '../Components/CampaignNew';
import Container from '../Components/Container'
import withActionMenu from '../Hocs/withActionMenu'

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
    showFormModal: false,
    submittingForm: false,
    campaigns: [],
    dcampaigns: [
      {
        id: '1',
        active: true,
        campaignTemplate: {
          name: 'Campaign #1',
        }
      }
    ]
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

  _updateCampaignStatus = (campaign, active) =>
    console.log(active)

  componentDidMount() {
    this.props.setActionMenu(<ActionMenu onClick={this._handleMenuClick.bind(this)} />)
  }

  componentWillUnmount() {
    this.props.setActionMenu(null)
  }

  render() {
    const { classes, onSubmit } = this.props;
    return (
      <Container>
        {
          this.state.showFormModal ? (
            <CampaignNew onClose={() => this.setState({showFormModal: false})} open={this.state.showFormModal} onSubmit={this._handleSubmit.bind(this)} submitting={this.state.submittingForm} />
          ) : (
            null
          )
        }
        <Paper elevation={2}>
          <List subheader={
            <ListSubheader>Manage Campaigns</ListSubheader>
          }>
            {
              !!this.state.campaigns.length ? (
                this.state.campaigns.map(campaign =>
                  <ListItem key={campaign.id}>
                    <ListItemText 
                      primary={campaign.campaignTemplate.name} 
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          onChange={this._updateCampaignStatus.bind(this, campaign, !campaign.active)}
                          checked={!!campaign.active}
                        />
                      </ListItemSecondaryAction>
                  </ListItem>      
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
          </List>
        </Paper>
      </Container>
    )
  }
}

export default withMobileDialog()(withStyles(styles)(withActionMenu()(CampaignList)));