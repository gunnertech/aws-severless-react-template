import React from 'react';


import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Divider from '@material-ui/core/Divider';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const options = [
  {
    id: "1",
    value: 1,
    name: "Extremely Unsatisfied",
    position: 1
  },
  {
    id: "2",
    value: 2,
    name: "Unsatisfied",
    position: 2
  },
  {
    id: "3",
    value: 3,
    name: "Neutral",
    position: 3
  },
  {
    id: "4",
    value: 4,
    name: "Satisfied",
    position: 4
  },
  {
    id: "5",
    value: 5,
    name: "Extremely Satisfied",
    position: 5
  }
]

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

class CampaignNew extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedCampaignId: null,
      submitting: false,
      expanded: null,
      campaignTemplates: [
        {
          id: "1",
          name: "Campaign #1",
          surveyTemplates: {
            items: [
              {
                id: "1",
                name: "Survey #1",
                prompts: {
                  items: [{
                    id: "1",
                    body: "Rate your experience",
                    position: 1,
                    options: {
                      items: options
                    }
                  }]
                }
              }
            ]
          }
        },
        {
          id: "2",
          name: "Campaign #2",
          surveyTemplates: {
            items: [
              {
                id: "1",
                name: "Survey #1",
                prompts: {
                  items: [{
                    id: "1",
                    body: "Rate your experience",
                    position: 1,
                    options: {
                      items: options
                    }
                  }]
                }
              },
              {
                id: "1",
                name: "Survey #2",
                prompts: {
                  items: [
                    {
                      id: "1",
                      body: "How Happy are you?",
                      position: 1,
                      options: {
                        items: options
                      }
                    },
                    {
                      id: "2",
                      body: "How Sad are you?",
                      position: 2,
                      options: {
                        items: options
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
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
        <DialogTitle id="responsive-dialog-title">{"Select a Campaign"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a campaign from the following templates. 
          </DialogContentText>
          {
            this.state.campaignTemplates.map(campaignTemplate => 
              <ExpansionPanel 
                key={campaignTemplate.id} 
                expanded={expanded === `panel${campaignTemplate.id}`} 
                onChange={this._handleChange.bind(this, `panel${campaignTemplate.id}`)}>
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{campaignTemplate.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails}>
                  {
                    campaignTemplate.surveyTemplates.items.map(surveyTemplate =>
                      <div className={classes.surveyTemplate} key={`surveyTemplate-${surveyTemplate.id}`}>
                        <div className={classes.surveyTemplateBody}>
                          <Typography variant="h6">{surveyTemplate.name}</Typography>
                          {
                            surveyTemplate.prompts.items.map(prompt =>
                              <div className={classes.promptWrapper} key={`prompt-${prompt.id}`}>
                                <Typography variant="subtitle1">{prompt.body}</Typography>
                                <div className={classes.prompt}>
                                  {
                                    prompt.options.items.map(option => 
                                      <div className={classes.option} key={`option-${option.id}`}>
                                        <img 
                                          src={require(`../assets/images/survey/${option.position}.png`)} 
                                          style={{width: '100%', height: 'auto'}} 
                                        />
                                        <Typography variant="caption" align={`center`}>{option.name}</Typography>
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    )
                  }
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                  <Button size="small" color="primary" onClick={() => this.setState({selectedCampaignId: campaignTemplate.id})}>
                    Select
                  </Button>
                </ExpansionPanelActions>
              </ExpansionPanel>
            )
          }
          {
            submitting ? (
              <CircularProgress className={classes.progress} color="secondary" />
            ) : (
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button variant="contained" disabled={!this.state.selectedCampaignId} onClick={this._handleSubmit.bind(this, {...this.state}, onSubmit)} color="primary" autoFocus>
                  Add Campaign
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