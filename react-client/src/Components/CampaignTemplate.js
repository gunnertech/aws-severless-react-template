import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
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

class CampaignTemplate extends React.Component {
  render() {
    const { campaignTemplate, expanded, onChange, onSelect, classes, PanelActions, campaign } = this.props;
    return (
      <ExpansionPanel 
        expanded={expanded === `panel${campaignTemplate.id}`} 
        onChange={onChange.bind(null, `panel${campaignTemplate.id}`)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{campaignTemplate.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelDetails}>
          {
            ((campaignTemplate.surveyTemplates||{}).items||[]).map(surveyTemplate =>
              <div className={classes.surveyTemplate} key={`surveyTemplate-${surveyTemplate.id}-${campaignTemplate.id}`}>
                <div className={classes.surveyTemplateBody}>
                  <Typography variant="h6">{surveyTemplate.name}</Typography>
                  {
                    ((surveyTemplate.prompts||{}).items||[]).map(prompt =>
                      <div className={classes.promptWrapper} key={`prompt-${prompt.id}`}>
                        <Typography variant="subtitle1">{prompt.body}</Typography>
                        <div className={classes.prompt}>
                          {
                            ((prompt.options||{}).items||[]).map(option => 
                              <div className={classes.option} key={`option-${option.id}`}>
                                <img 
                                  src={require(`../assets/images/survey/${option.position}.png`)} 
                                  style={{width: '100%', height: 'auto'}} 
                                  alt={option.name}
                                />
                                <Hidden smUp>
                                  <Typography style={{fontSize: 8}} variant="caption" align={`center`}>{option.name}</Typography>
                                </Hidden>
                                <Hidden xsDown>
                                  <Typography variant="caption" align={`center`}>{option.name}</Typography>
                                </Hidden>
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
          <PanelActions id={campaign ? campaign.id : campaignTemplate.id} onActionClick={onSelect} />
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(CampaignTemplate);