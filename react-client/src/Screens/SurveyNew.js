import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Typography, Hidden, Paper, Button, Divider } from '@material-ui/core';

import { Query, compose, graphql } from 'react-apollo';

import withLayout from '../Hocs/withLayout'

import GetSurvey from '../api/Queries/GetSurvey';
import CreateResponse from '../api/Mutations/CreateResponse';

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
    optionId: null,
    submitting: false,
    submitted: false
  }

  _handleOptionSelect = (selectedOption, options) =>
    new Promise(resolve => 
      this.setState({
        optionId: selectedOption.id,
        reason: (selectedOption.position >= options.length-1 ? (
          window.prompt("(Optional) Please explain your response")
        ) : (
          ""
        ))
      }, resolve)
    )

  _handleSubmit = () => console.log("STATE", this.state) ||
    (new Promise(resolve => this.setState({submitting: true}, resolve({
      id: (new Date().getTime()).toString(),
      optionId: this.state.optionId,
      reason: !!this.state.reason ? this.state.reason : undefined,
      surveyId: this.props.match.params.surveyId,
      createdAt: (new Date()).toISOString()
    }))))
      .then(params => console.log("PARAMS", params) ||
        this.props.createResponse({ 
          variables: { 
            ...params,
            __typename: "Response"
          },
          onError: console.log,
          optimisticResponse: {
            __typename: "Mutation",
            createResponse: { 
              ...params,
              reason: params.reason || null,
              __typename: "Response"
            }
          }
        })
      )
      .then(() =>
        new Promise(resolve => this.setState({submitting: false, submitted: true}, resolve))
      )

  componentDidMount() {
    if(typeof(window) !== "undefined" && window.screen && window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation.lock("landscape")
        .catch(console.log)
    }

    this.props.hideNav();
  }

  render() {
    const { classes, match: { params: { surveyId }} } = this.props;
    const { submitted, submitting } = this.state;
    return (
      submitted ? (
        "Thank you for your participation!"
      ) : submitting ? (
        "Submitting..."
      ) : (
        <Query
          query={GetSurvey}
          variables={{id: surveyId}}
        >
        {({loading, error, data}) => console.log(data) ||
          error ? ( console.log(error) ||
            "Something went wrong..."
          ) : loading ? (
            "Loading..."
          ) : data && data.getSurvey ? (
            !!data.getSurvey.responses.items.length ? (
              "Thank you for your participation!"
            ) : (
              <Paper elevation={2} className={classes.root}>
                <div>
                  <Typography variant="h4">{data.getSurvey.user.organization.name} Survey</Typography>
                  <Typography paragraph>Please answer all prompts by clicking your response and then click "Submit" when finished.</Typography>
                </div>
                <div className={classes.surveyTemplate}>
                  <div className={classes.surveyTemplateBody}>
                    {
                      (data.getSurvey.surveyTemplate.prompts||{}).items.map(prompt =>
                        <div className={classes.promptWrapper} key={`prompt-${prompt.id}`}>
                          <Typography variant="subtitle1">{prompt.body}</Typography>
                          <div className={classes.prompt}>
                            {
                              prompt.options.items.map(option => 
                                <div className={classes.option} key={`option-${option.id}`}>
                                  <img
                                    onClick={this._handleOptionSelect.bind(this, option, prompt.options.items)} 
                                    src={require(`../assets/images/survey/${option.position}.png`)} 
                                    style={{width: '100%', height: 'auto', cursor: 'pointer'}} 
                                    alt={option.name}
                                  />
                                  <Hidden smUp>
                                    <Typography 
                                      onClick={this._handleOptionSelect.bind(this, option, prompt.options.items)} 
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
                                      onClick={this._handleOptionSelect.bind(this, option, prompt.options.items)} 
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
                <p>{data.getSurvey.user.name || data.getSurvey.user.id} sent you this survey.</p>
                <Divider />
                <Button disabled={!this.state.optionId} variant="contained" onClick={this._handleSubmit.bind(this)} className={classes.button} color="primary">Submit</Button>
              </Paper>
            )
          ) : (
            "Something Went Wrong"
          )
        }
        </Query>
      )
    )
  }
}

export default compose(
  withLayout(),
  withStyles(styles),
  graphql(CreateResponse, { name: "createResponse" }),
)(SurveyNew);