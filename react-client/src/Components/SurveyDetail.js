import React from 'react';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { Query } from 'react-apollo';

import moment from 'moment';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

import QuerySurveysByCampaignIdCreatedAtIndex from '../api/Queries/QuerySurveysByCampaignIdCreatedAtIndex'
import ResponseList from '../Components/ResponseList'

//NPS = (Number of Promoters — Number of Detractors) / (Number of Respondents) x 100
//Promoters = 4-5
//Passives = 3

const promoters = [5];
// const passives = [3, 4];
const detractors = [1, 2];

const SimpleLineChart = props => console.log(props) ||
  <ResponsiveContainer>
    <LineChart data={props.data.map(point => ({name: moment(point.endDate).format("M-D-YYYY"), score: point.score}))} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
      <Tooltip />
      <YAxis type="number" domain={['auto', 'auto']} />
      <XAxis dataKey="name" />
      <Line name="NPS" type="monotone" dataKey="score" stroke="#b78df9" activeDot={{r: 8}} />

    </LineChart>
  </ResponsiveContainer>

const colors = [
  "#39b549",
  "#91c95f",
  "#faaf40",
  "#f05a29",
  "#df1f24"
]


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
  prompt: {
    display: 'flex', 
    flexDirection: 'row',
    marginTop: theme.spacing.unit * 2
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

class SurveyDetail extends React.PureComponent {
  static defaultProps = {
    endDate: new Date()
  }

  state = {
    selectedOption: null,
    netPromoterScoreDelta: 0
  }

  surveysForOption = (optionId, startDate, endDate, userId, surveys) =>
    this.validSurveys(startDate, endDate, userId, surveys)
      .filter(survey => survey.responses.items.find( response => response.optionId === optionId))

  responseCountForOption = (optionId, startDate, endDate, userId, surveys) =>
    this.surveysForOption(optionId, startDate, endDate, userId, surveys)
      .length

  validSurveys = (startDate, endDate, userId, surveys) =>
    surveys.filter(survey => 
      survey.createdAt > startDate.toISOString() && 
      survey.createdAt <= endDate.toISOString() && 
      (!userId || userId === survey.userId))

  responseCount = (options, startDate, endDate, userId, surveys, range) =>
    options
      .filter(option => !range || (option.value >= range[0] && option.value <= range[range.length-1]))
      .map(option => 
        this.responseCountForOption(option.id, startDate, endDate, userId, surveys)
      )
      .reduce((count, currentValue) => count + currentValue)

  netPromoterScore = (options, startDate, endDate, userId, surveys) =>
    !!this.responseCount(options, startDate, endDate, userId, surveys) ? (
      Math.round((
        (
          this.responseCount(options, startDate, endDate, userId, surveys, promoters) - this.responseCount(options, startDate, endDate, userId, surveys, detractors)
        )
        / this.responseCount(options, startDate, endDate, userId, surveys)
      ) 
      * 100)
    ) : (
      0
    )
  
  dayDiff = (startDate, endDate) =>
    moment(endDate).diff(moment(startDate), 'days');
      
  netPromoterScoreDelta = (options, startDate, endDate, userId, surveys) => (
    this.netPromoterScore(options, startDate, endDate, userId, surveys) - 
    this.netPromoterScore(options, moment(startDate).subtract(this.dayDiff(startDate, endDate), 'days').toDate(), moment(endDate).subtract(this.dayDiff(startDate, endDate), 'days').toDate(), userId, surveys)
  )

  npsData = (options, startDate, endDate, userId, surveys, dayDiff, count) => console.log("options", options) ||
    [...Array(count).keys()]
      .map(i => ({
        endDate: moment(endDate).startOf('day').subtract(dayDiff * i, "days").toDate(), 
        score: this.netPromoterScore(options, moment(startDate).startOf('day').subtract(dayDiff * i, "days").toDate(), moment(endDate).startOf('day').subtract(dayDiff * i, "days").toDate(), userId, surveys)
      }))

  render() {
    const { surveyTemplate, classes, startDate, campaignId, userId, endDate } = this.props;
    const { selectedOption } = this.state;
    return (
      <Query
        query={ QuerySurveysByCampaignIdCreatedAtIndex }
        fetchPolicy="cache-and-network"
        variables={{campaignId}}
      >
        { ({loading, error, data}) => loading ? "Loading..." : error ? JSON.stringify(error) : (!data.querySurveysByCampaignIdCreatedAtIndex || !data.querySurveysByCampaignIdCreatedAtIndex.items) ? "Something went wrong..." :
          <div>
            {
              selectedOption &&
              <ResponseList option={selectedOption} surveys={this.surveysForOption(selectedOption.id, startDate, endDate, userId, data.querySurveysByCampaignIdCreatedAtIndex.items)} open={!!selectedOption} onClose={() => this.setState({selectedOption: null})} />
            }
            
            {
              surveyTemplate.prompts.items.map(prompt =>
                <div key={`prompt-${prompt.id}`}>
                  <div className={classes.promptWrapper}>
                    <Typography variant="subtitle1">
                      {prompt.body} - {this.responseCount(prompt.options.items, startDate, endDate, userId, data.querySurveysByCampaignIdCreatedAtIndex.items)} responses
                    </Typography>
                    <div className={classes.prompt}>
                      {
                        prompt.options.items.map(option =>
                          <div className={classes.option} key={`option-${option.id}`}>
                            <div style={{height: (Math.max(...prompt.options.items.map(option => this.responseCountForOption(option.id, startDate, endDate, userId, data.querySurveysByCampaignIdCreatedAtIndex.items))) || 0) * 10, display: "flex", alignItems: "flex-end"}}>
                              <div style={{height: this.responseCountForOption(option.id, startDate, endDate, userId, data.querySurveysByCampaignIdCreatedAtIndex.items) * 10, backgroundColor: colors[option.position-1], width: '100%'}}></div>
                            </div>
                            <img
                              onClick={() => option.position > 3 ? this.setState({selectedOption: option}) : null} 
                              src={require(`../assets/images/survey/${option.position}.png`)} 
                              style={{width: '100%', height: 'auto', cursor: option.position > 3 ? 'pointer' : 'default'}} 
                              alt={option.name}
                            />
                            <Hidden smUp>
                              <Typography 
                                onClick={() => option.position > 3 ? this.setState({selectedOption: option}) : null} 
                                color={option.position > 3 ? 'secondary' : 'default'} 
                                style={{cursor: option.position > 3 ? 'pointer' : 'default', fontSize: 8}} 
                                variant="caption" 
                                align={`center`}
                              >
                                {option.name}
                              </Typography>
                            </Hidden>
                            <Hidden xsDown>
                              <Typography 
                                onClick={() => option.position > 3 ? this.setState({selectedOption: option}) : null} 
                                color={option.position > 3 ? 'secondary' : 'default'} 
                                style={{cursor: option.position > 3 ? 'pointer' : 'default'}} 
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
                  <div style={{flex: 1, display: "flex", flexDirection: "row"}}>
                    <div style={{flex: 1}}>
                      <Typography variant="h5" align={`center`}>NPS: {this.netPromoterScore(prompt.options.items, startDate, endDate, userId, data.querySurveysByCampaignIdCreatedAtIndex.items)}</Typography>
                      <NpsDelta delta={this.netPromoterScoreDelta(prompt.options.items, startDate, endDate, userId, data.querySurveysByCampaignIdCreatedAtIndex.items)} />
                    </div>
                    <div style={{flex: 1}}>
                      <SimpleLineChart data={this.npsData(prompt.options.items, startDate, endDate, userId, data.querySurveysByCampaignIdCreatedAtIndex.items, this.dayDiff(startDate, endDate), 7).reverse()} />
                    </div>
                    
                  </div>
                </div>
              )
            }
            
          </div>
        }
      </Query>
    )
  }
}

const NpsDelta = ({delta}) => 
<Typography variant="h5" align={`center`} style={{color: `${delta > 0 ? colors[0] : delta < 0 ? colors[colors.length-1] : 'black'}`}}>Change: {delta > 0 ? '+' : delta < 0 ? '' : ''}{delta}</Typography>


export default withStyles(styles)(SurveyDetail)