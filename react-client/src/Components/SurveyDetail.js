import React from 'react';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';

import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';


import ResponseList from '../Components/ResponseList'

const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 4490, pv: 4300, amt: 2100},
];

const SimpleLineChart = props =>
  <ResponsiveContainer>
    <LineChart data={data}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}>

      <Tooltip/>
      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}} />

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

class SurveyDetail extends React.PureComponent {
  state = {
    selectedPromptId: null
  }

  render() {
    const { survey, classes } = this.props;
    return (
      <div>
        <ResponseList open={!!this.state.selectedPromptId} onClose={() => this.setState({selectedPromptId: null})} />
        {
          survey.surveyTemplate.prompts.items.map(prompt =>
            <div className={classes.promptWrapper} key={`prompt-${prompt.id}`}>
              <Typography variant="subtitle1">{prompt.body}</Typography>
              <div className={classes.prompt}>
                {
                  prompt.options.items.map(option => 
                    <div className={classes.option} key={`option-${option.id}`}>
                      <div style={{height: 60 * 10, display: "flex", alignItems: "flex-end"}}>
                        <div style={{height: option.count * 10, backgroundColor: colors[option.position-1], width: '100%'}}></div>
                      </div>
                      <img
                        onClick={() => option.position > 3 ? this.setState({selectedPromptId: prompt.id}) : null} 
                        src={require(`../assets/images/survey/${option.position}.png`)} 
                        style={{width: '100%', height: 'auto', cursor: option.position > 3 ? 'pointer' : 'default'}} 
                        alt={option.name}
                      />
                      <Hidden smUp>
                        <Typography 
                          onClick={() => option.position > 3 ? this.setState({selectedPromptId: prompt.id}) : null} 
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
                          onClick={() => option.position > 3 ? this.setState({selectedPromptId: prompt.id}) : null} 
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
          )
        }
        <div style={{flex: 1, display: "flex", flexDirection: "row"}}>
          <div style={{flex: 1}}>
            <Typography variant="h5" align={`center`}>NPS: 9.5</Typography>
            <Typography variant="h5" align={`center`} style={{color: "#44e200"}}>+0.5</Typography>
          </div>
          <div style={{flex: 1}}>
            <SimpleLineChart />
          </div>
          
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(SurveyDetail)