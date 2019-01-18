import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Query, withApollo } from 'react-apollo';
import moment from 'moment';


import QueryUsersByOrganizationIdCreatedAtIndex from "../api/Queries/QueryUsersByOrganizationIdCreatedAtIndex"
import QuerySurveysByCampaignIdCreatedAtIndex from '../api/Queries/QuerySurveysByCampaignIdCreatedAtIndex';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@material-ui/core';

import ExportIcon from 'mdi-material-ui/Export';

import Container from '../Components/Container'
import AlertDialog from '../Components/AlertDialog'
import SurveyDetail from '../Components/SurveyDetail';
import UserSurveyDetail from '../Components/UserSurveyDetail';

import withActionMenu from '../Hocs/withActionMenu'
import withCurrentUser from '../Hocs/withCurrentUser';

import campaignToCSV from '../Util/campaignToCSV'
import emailCSV from '../Util/emailCSV'

const ActionMenu = ({onClick}) => (
  <IconButton
    aria-haspopup="true"
    onClick={onClick}
    color="inherit"
  >
    <ExportIcon />
  </IconButton>
)

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
    selectedSurveyTemplate: null,
    startDate: moment().subtract(7, 'days').toDate(),
    daysAgo: 7,
    expanded: null,
    selectedCampaignId: null,
    sendingEmail: false
  };

  _handleMenuClick = () =>
    new Promise(resolve => this.setState({sendingEmail: true}, resolve))
      .then(() => 
        this.props.client.query({
          query: QuerySurveysByCampaignIdCreatedAtIndex,
          variables: { campaignId: this.state.selectedCampaignId },
        })
      )
      .then(({ data, loading, error }) => data.querySurveysByCampaignIdCreatedAtIndex.items)
      .then(surveys => campaignToCSV(
        this.props.currentUser.organization.campaigns.items.find(campaign => campaign.id === this.state.selectedCampaignId),
        surveys
      ))
      .then(csv => emailCSV(this.props.currentUser.email, csv))
      .then(() => new Promise(resolve => setTimeout(() => 
        this.setState({sendingEmail: false}, resolve)
      ,5000)))
      .catch(console.log)

  _handleTabChange = (event, value) =>
    new Promise(resolve => this.setState({ selectedCampaignId: value, selectedSurveyTemplateId: null, selectedSurveyTemplate: null }, () => resolve(value)))
      .then(selectedCampaignId =>
        Promise.resolve(this.props.currentUser.organization.campaigns.items.find(campaign => campaign.id === selectedCampaignId).campaignTemplate.surveyTemplates.items[0])
      )
      .then(selectedSurveyTemplate =>
        new Promise(resolve => this.setState({ 
          selectedSurveyTemplate,
          selectedSurveyTemplateId: selectedSurveyTemplate.id
        }, resolve))
      )
      .then(() => console.log("done"))

  _handleSurveyTemplateChange = event => 
    new Promise(resolve => this.setState({ selectedSurveyTemplateId: event.target.value }, () => resolve(event.target.value)))
      .then(selectedSurveyTemplateId =>
        new Promise(resolve => this.setState({ 
          selectedSurveyTemplate: this.props.currentUser.organization.campaigns.items.find(campaign => campaign.id === this.state.selectedCampaignId).campaignTemplate.surveyTemplates.items.find(surveyTemplate => surveyTemplate.id === selectedSurveyTemplateId)
        }, resolve))
      )
      .then(() => console.log("done"))

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
    if(!!this.props.currentUser.organization.campaigns.items.filter(campaign => campaign.active).length) {
      this.setState({
        selectedSurveyTemplate: this.props.currentUser.organization.campaigns.items.filter(campaign => campaign.active)[0].campaignTemplate.surveyTemplates.items[0],
        selectedCampaignId: this.props.currentUser.organization.campaigns.items.filter(campaign => campaign.active)[0].id
      })
    }

    this.props.setActionMenu(<ActionMenu onClick={this._handleMenuClick.bind(this)} />)
  }

  render() {
    const { classes, currentUser } = this.props;
    const { selectedCampaignId, expanded, selectedSurveyTemplate, startDate, sendingEmail } = this.state;
    console.log(currentUser)
    return (
      <Container>
        { 
          !currentUser.organization.campaigns.items.length ? (
            <Welcome currentUser={currentUser} />
          ) : !selectedCampaignId ? null : (
            <div>
              <AppBar position="static" color="default">
                <Tabs
                  value={selectedCampaignId}
                  onChange={this._handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {
                    currentUser.organization.campaigns.items.filter(campaign => campaign.active).map(campaign =>
                      <Tab value={campaign.id} key={campaign.id} label={campaign.campaignTemplate.name.replace(/ Campaign$/, "")} />    
                    )
                  }
                </Tabs>
              </AppBar>
              {
                sendingEmail && <AlertDialog open={true} title={`Campaign Exported`} text={`An email will be sent to your inbox when the export is complete`} />
              }
              {
                currentUser.organization.campaigns.items.filter(campaign => campaign.active).map((campaign, i) =>
                  selectedCampaignId === campaign.id && 
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
                        <InputLabel htmlFor="dateSpan">Responses From the Last:</InputLabel>
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
                            variables={{organizationId: currentUser.organization.id, first: 1000}}
                          >
                            { ({loading, error, data}) => loading ? "Loading..." : error ? JSON.stringify(error) : (!data.queryUsersByOrganizationIdCreatedAtIndex || !data.queryUsersByOrganizationIdCreatedAtIndex.items) ? "Something went wrong..." :
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


export default withRouter(
  withCurrentUser()(
    withMobileDialog()(
      withStyles(styles)(
        withActionMenu()(
          withApollo(Home)
        )
      )
    )
  )
);