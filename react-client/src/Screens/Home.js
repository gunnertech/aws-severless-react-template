import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';



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



import campaigns from '../Mocks/campaigns'

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
    campaigns: campaigns,
    expanded: null,
    users: [
      {
        id: "codyswann",
        email: 'cody@gunnertech.com',
      },
      {
        id: "sam",
        email: 'sam.petteway@qualismanagement.com',
      }
    ]
  };

  _handleTabChange = (event, value) =>
    this.setState({ value });

  _handleChange = (panel, event, expanded) =>
    this.setState({
      expanded: expanded ? panel : false,
    })

  render() {
    const { classes, currentUser } = this.props;
    const { value, expanded } = this.state;
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
                    this.state.campaigns.map(campaign =>
                      <Tab key={campaign.id} label={campaign.campaignTemplate.name} />    
                    )
                  }
                </Tabs>
              </AppBar>
              {
                this.state.campaigns.map((campaign, i) =>
                  value === i && 
                  <TabContainer key={i}>
                    <form className={classes.formRoot} autoComplete="off">
                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="survey">Select a Survey</InputLabel>
                        <Select
                          value={campaign.campaignTemplate.surveyTemplates.items[0].id}
                          onChange={console.log}
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
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel htmlFor="dateSpan">30 Responses Over the Last:</InputLabel>
                        <Select
                          value={7}
                          onChange={console.log}
                          inputProps={{
                            name: 'dateSpan',
                            id: 'dateSpan',
                          }}
                        >
                          {
                            [...Array(31).keys()].map(count => 
                              <MenuItem key={count} value={count}>{count} Days</MenuItem>
                            )
                          }
                        </Select>
                      </FormControl>
                      <SurveyDetail survey={{surveyTemplate: campaign.campaignTemplate.surveyTemplates.items[0]}} />

                      <Typography variant="h5">By User</Typography>
                      {
                        this.state.users.map(user => 
                          <UserSurveyDetail expanded={expanded} key={user.id} onChange={this._handleChange.bind(this)} user={user} survey={{surveyTemplate: campaign.campaignTemplate.surveyTemplates.items[0]}} />
                        )
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