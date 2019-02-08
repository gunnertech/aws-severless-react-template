import React from 'react';


import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Query } from 'react-apollo';


import CampaignTemplate from './CampaignTemplate';

import ListCampaignTemplates from '../api/Queries/ListCampaignTemplates';

const PanelActions = props =>
  <Button size="small" color="primary" onClick={() => props.onActionClick(props.id)}>
    Select
  </Button>

const styles = theme => ({
  panelDetails: {
    flexFlow: "wrap"
  },
  surveyTemplate: {
    flex: '0 0 100%', 
    display: 'flex',
    marginBottom: theme.spacing.unit * 4
  },
  prompt: {display: 'flex', flexDirection: 'row'},
  option: {
    flex: 1,
    margin: theme.spacing.unit
  },
  surveyTemplateBody: {flex: 1},
  promptWrapper: {
    marginBottom: theme.spacing.unit * 2
  }
});

class CampaignNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCampaignId: null,
      submitting: false,
      expanded: null,
    }

    this._initialState = {...this.state}
  }

  _handleChange = (panel, event, expanded) =>
    this.setState({
      expanded: expanded ? panel : false,
    })

  _handleSubmit = (data, cb) =>
    Promise.all([
      this.setState(this._initialState),
      cb(data)
    ])

  _resetState = () =>
    this.setState(this._initialState)

  render() {
    const { classes, open, submitting, onSubmit, onClose, fullScreen } = this.props;
    const { expanded } = this.state;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{`Select a Campaign Template`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a campaign from the following templates. 
          </DialogContentText>
          <Query
            query={ ListCampaignTemplates }
            fetchPolicy="cache-and-network"
          >
            {({ data: {listCampaignTemplates}, loading }) =>
              loading ? (
                "Loding..."
              ) : listCampaignTemplates && listCampaignTemplates.items ? (
                listCampaignTemplates.items.map(campaignTemplate => 
                  <CampaignTemplate 
                    hideText={true}
                    expanded={expanded} 
                    key={campaignTemplate.id} 
                    campaignTemplate={campaignTemplate}
                    onSelect={selectedCampaignId => this.setState({selectedCampaignId})}  
                    onChange={this._handleChange.bind(this)}
                    PanelActions={PanelActions}
                  />
                )
              ) : (
                "Something went wrong..."
              )
            }
          </Query>
          {
            submitting ? (
              <CircularProgress className={classes.progress} color="secondary" />
            ) : (
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button variant="contained" disabled={!this.state.selectedCampaignId} onClick={this._handleSubmit.bind(this, {...this.state}, onSubmit)} color="primary" autoFocus>
                  Add
                </Button>
              </DialogActions>
            )
          }
        </DialogContent>
      </Dialog>
    )
  }
}


export default withStyles(styles)(CampaignNew);