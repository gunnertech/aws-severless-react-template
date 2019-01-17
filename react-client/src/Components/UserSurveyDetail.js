import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SurveyDetail from './SurveyDetail';

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

class UserSurveyDetail extends React.Component {
  render() {
    const { expanded, onChange, classes, user, surveyTemplate, campaignId, startDate } = this.props;
    return (
      <ExpansionPanel 
        expanded={expanded === `panel${user.id}`} 
        onChange={onChange.bind(null, `panel${user.id}`)}>
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{user.name || user.id}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelDetails}>
          <SurveyDetail 
            surveyTemplate={surveyTemplate} 
            campaignId={campaignId}
            startDate={startDate}
            userId={user.id}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(UserSurveyDetail);