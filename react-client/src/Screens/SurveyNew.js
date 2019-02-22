import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Typography, Hidden, Paper, Button, Divider } from '@material-ui/core';

import { Query, compose, graphql } from 'react-apollo';

import withLayout from '../Hocs/withLayout'

import GetSurvey from '../api/Queries/GetSurvey';
import GetUser from '../api/Queries/GetUser';
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
  selectedOption: {
    backgroundColor: theme.palette.secondary.main,
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

class SurveyNew extends React.Component {
  state = {
    optionId: null,
    prompts: {

    },
    submitting: false,
    submitted: false
  }

  _handleOptionSelect = (promptId, selectedOption, options) =>
    new Promise(resolve => 
      this.setState({
        prompts: {
          ...this.state.prompts,
          [promptId]: {
            optionId: selectedOption.id,
            reason: (true || selectedOption.position >= options.length-1 ? (
              window.prompt("(Optional) Please explain your response")
            ) : (
              ""
            ))
          }
        }
      }, resolve)
    )

  _handleSubmit = () =>
    Promise.all(
      Object.keys(this.state.prompts).map( (promptId, i) => 
        (new Promise(resolve => this.setState({submitting: true}, resolve({
          id: `${(new Date().getTime()).toString()}-${i}`,
          optionId: this.state.prompts[promptId].optionId,
          reason: !!this.state.prompts[promptId].reason ? this.state.prompts[promptId].reason : undefined,
          surveyId: this.props.match.params.surveyId,
          createdAt: (new Date()).toISOString()
        }))))
          .then(params =>
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
      )
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
    const { submitted, submitting, prompts } = this.state;
    return (
      submitted ? (
        <Typography style={{textAlign: "center", marginTop: 20}} variant="h4">Thank you for your participation!</Typography>
      ) : submitting ? (
        "Submitting..."
      ) : (
        <Query
          query={GetSurvey}
          variables={{id: surveyId}}
        >
        {({loading, error, data, refetch}) => console.log("GetSurvey",error) ||
          error ? (
            "Something went wrong..."
          ) : loading ? (
            "Loading..."
          ) : data && data.getSurvey ? (
            !!data.getSurvey.responses.items.length ? (
              <Typography style={{textAlign: "center", marginTop: 20}} variant="h4">Thank you for your participation!</Typography>
            ) : !data.getSurvey.surveyTemplate ? (
              refetch().then(() => this.setState({reload: true})) && (console.log("GOT IT") || "Loading...") //BUG: Fix this. Weird bug with AppSync/Resolver where data.getSurvey.surveyTemplate is sometimes null
            ) : (
              <Query
                query={GetUser}
                variables={{id: data.getSurvey.userId}}
              >
                {({data: { getUser } = {}}) => !getUser ? null :
                  <Paper elevation={2} className={classes.root}>
                    <div>
                      <Typography variant="h4">{getUser.organization.name} Survey</Typography>
                      <Typography paragraph>Please answer all prompts by clicking your response and then click "Submit" when finished.</Typography>
                    </div>
                    <div className={classes.surveyTemplate}>
                      <div className={classes.surveyTemplateBody}>
                        {
                          (((data.getSurvey.surveyTemplate||{}).prompts||{}).items||[]).map(prompt =>
                            <div className={classes.promptWrapper} key={`prompt-${prompt.id}`}>
                              <Typography variant="subtitle1">{prompt.body}</Typography>
                              <div className={classes.prompt}>
                                {
                                  prompt.options.items.map(option => 
                                    <div className={prompts[prompt.id] && prompts[prompt.id].optionId === option.id ? `${classes.selectedOption} ${classes.option}` : classes.option} key={`option-${option.id}`}>
                                      <img
                                        onClick={this._handleOptionSelect.bind(this, prompt.id, option, prompt.options.items)} 
                                        src={require(`../assets/images/survey/${option.position}.png`)} 
                                        style={{width: '100%', height: 'auto', cursor: 'pointer'}} 
                                        alt={option.name}
                                      />
                                      <Hidden smUp>
                                        <Typography 
                                          onClick={this._handleOptionSelect.bind(this, prompt.id, option, prompt.options.items)} 
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
                                          onClick={this._handleOptionSelect.bind(this, prompt.id, option, prompt.options.items)} 
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
                    <p>{getUser.name} sent you this survey.</p>
                    <Divider />
                    <Button disabled={!Object.keys(this.state.prompts).length || Object.keys(this.state.prompts).length !== data.getSurvey.surveyTemplate.prompts.items.length} variant="contained" onClick={this._handleSubmit.bind(this)} className={classes.button} color="primary">Submit</Button>
                  </Paper>
                }
              </Query>
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