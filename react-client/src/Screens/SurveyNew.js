import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Typography, Hidden, Paper, Button, Divider } from '@material-ui/core';

import withLayout from '../Hocs/withLayout'

import campaigns from '../Mocks/campaigns'

const styles = theme => ({
  surveyTemplate: {
    flex: '0 0 100%', 
    display: 'flex',
    marginBottom: theme.spacing.unit * 4
  },
  button: {
    marginTop: theme.spacing.unit * 2
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
  },
  root: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  }
});

class SurveyNew extends React.PureComponent {
  state = {
    survey: {
      surveyTemplate: campaigns[0].campaignTemplate.surveyTemplates.items[0]
    }
  }

  componentDidMount() {
    if(typeof(window) !== "undefined" && window.screen && window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation.lock("landscape");
    }
    this.props.hideNav()
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper elevation={2} className={classes.root}>
        <div>
          <Typography variant="h4">Hospice of Michigan Survey</Typography>
          <Typography paragraph>Please answer all prompts by clicking your response and then click "Submit" when finished.</Typography>
        </div>
        <div className={classes.surveyTemplate}>
          <div className={classes.surveyTemplateBody}>
            {
              this.state.survey.surveyTemplate.prompts.items.map(prompt =>
                <div className={classes.promptWrapper} key={`prompt-${prompt.id}`}>
                  <Typography variant="subtitle1">{prompt.body}</Typography>
                  <div className={classes.prompt}>
                    {
                      prompt.options.items.map(option => 
                        <div className={classes.option} key={`option-${option.id}`}>
                          <img
                            onClick={() => console.log("done!")} 
                            src={require(`../assets/images/survey/${option.position}.png`)} 
                            style={{width: '100%', height: 'auto', cursor: 'pointer'}} 
                            alt={option.name}
                          />
                          <Hidden smUp>
                            <Typography 
                              onClick={() => console.log("done!")} 
                              color={'secondary'} 
                              style={{cursor: 'pointer', fontSize: 8}} 
                              variant="caption" 
                              align={`center`}
                            >
                              {option.name}
                            </Typography>
                          </Hidden>
                          <Hidden xsDown>
                            <Typography 
                              onClick={() => console.log("done!")} 
                              color={'secondary'} 
                              style={{cursor: 'pointer'}} 
                              variant="caption" 
                              align={`center`}
                            >
                              {option.name}
                            </Typography>
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
        <Divider />
        <Button variant="contained" className={classes.button} color="primary">Submit</Button>
      </Paper>
    )
  }
}

export default withLayout()(withStyles(styles)(SurveyNew));