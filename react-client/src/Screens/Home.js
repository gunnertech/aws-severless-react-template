import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import moment from 'moment';

import QueryUsersByOrganizationIdCreatedAtIndex from "../api/Queries/QueryUsersByOrganizationIdCreatedAtIndex"

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import Container from '../Components/Container'
import SurveyDetail from '../Components/SurveyDetail';
import UserSurveyDetail from '../Components/UserSurveyDetail';
import withCurrentUser from '../Hocs/withCurrentUser';



const Welcome = props =>
  <div>
    <p>Welcome, {props.currentUser.id}!</p>
    <p>It looks like you haven't created any campaigns yet.</p>
    <p><Link to={`/campaigns`}>Click here</Link> to set one up and get started!</p>
  </div>

const TabContainer = props =>
  <div>
    {props.children}
  </div>

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  formRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit * 4
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class Home extends React.Component {
  state = {
    value: 0,
    selectedSurveyTemplate: null,
    startDate: moment().subtract(7, 'days').toDate(),
    daysAgo: 7,
    expanded: null,
  };

  _handleTabChange = (event, value) =>
    this.setState({ value });

  _handleSurveyTemplateChange = event =>
    this.setState({ selectedSurveyTemplateId: event.target.value });

  _handleChange = (panel, event, expanded) =>
    this.setState({
      expanded: expanded ? panel : false,
    })

  _handleStartDateChange = event =>
    this.setState({
      startDate: moment().subtract(parseInt(event.target.value), 'days').toDate(),
      daysAgo: event.target.value
    })

  componentDidMount() {
    if(!!this.props.currentUser.organization.campaigns.items.length) {
      this.setState({
        selectedSurveyTemplate: this.props.currentUser.organization.campaigns.items[0].campaignTemplate.surveyTemplates.items[0]
      })
    }
  }

  render() {
    const { classes, currentUser } = this.props;
    const { value, expanded, selectedSurveyTemplate, startDate } = this.state;
    return (
      <Container>
        { 
          !currentUser.organization.campaigns.items.length ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <div>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={this._handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  scrollable
                  scrollButtons="auto"
                >
                  {
                    currentUser.organization.campaigns.items.map(campaign =>
                      <Tab key={campaign.id} label={campaign.campaignTemplate.name.replace(/ Campaign$/, "")} />    
                    )
                  }
                </Tabs>
              </AppBar>
              {
                currentUser.organization.campaigns.items.map((campaign, i) =>
                  value === i && 
                  <TabContainer key={i}>
                    <form className={classes.formRoot} autoComplete="off">
                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="survey">Select a Survey</InputLabel>
                        {
                          selectedSurveyTemplate &&
                          <Select
                            value={selectedSurveyTemplate.id}
                            onChange={this._handleSurveyTemplateChange.bind(this)}
                            inputProps={{
                              name: 'survey',
                              id: 'survey',
                            }}
                          >
                            {
                              campaign.campaignTemplate.surveyTemplates.items.map(surveyTemplate => 
                                <MenuItem key={surveyTemplate.id} value={surveyTemplate.id}>{surveyTemplate.name}</MenuItem>
                              )
                            }
                          </Select>
                        }
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="dateSpan">Showing Responses From the Last:</InputLabel>
                        <Select
                          value={this.state.daysAgo}
                          onChange={this._handleStartDateChange.bind(this)}
                          inputProps={{
                            name: 'dateSpan',
                            id: 'dateSpan',
                          }}
                        >
                          <MenuItem value={7}>7 Days</MenuItem>
                          <MenuItem value={30}>30 Days</MenuItem>
                          <MenuItem value={90}>90 Days</MenuItem>
                          <MenuItem value={180}>180 Days</MenuItem>
                          <MenuItem value={365}>12 Months</MenuItem>
                          <MenuItem value={540}>18 Months</MenuItem>
                          <MenuItem value={730}>24 Months</MenuItem>
                        </Select>
                      </FormControl>
                      
                      {
                        !!selectedSurveyTemplate && 
                        <div>
                          
                          <SurveyDetail 
                            surveyTemplate={selectedSurveyTemplate} 
                            campaignId={campaign.id}
                            startDate={startDate}
                          />

                          <Typography variant="h5">By User</Typography>
                          <Query
                            query={ QueryUsersByOrganizationIdCreatedAtIndex }
                            fetchPolicy="cache-and-network"
                            variables={{organizationId: currentUser.organization.id}}
                          >
                            { ({loading, error, data}) => loading ? "Loading..." : error ? JSON.stringify(error) : (!data.queryUsersByOrganizationIdCreatedAtIndex || !data.queryUsersByOrganizationIdCreatedAtIndex.items) ? "Something went wrong" :
                              data.queryUsersByOrganizationIdCreatedAtIndex.items.map(user => 
                                <UserSurveyDetail 
                                  expanded={expanded} 
                                  key={user.id} 
                                  onChange={this._handleChange.bind(this)} 
                                  user={user} 
                                  surveyTemplate={selectedSurveyTemplate}
                                  campaignId={campaign.id}
                                  startDate={startDate}
                                />
                              )
                            }
                          </Query>
                        </div>
                      }
                    </form>
                  </TabContainer>
                )
              }
            </div>
          )
        }
    </Container>
    )
  }
}


export default withRouter(withCurrentUser()(withMobileDialog()(withStyles(styles)(Home))));