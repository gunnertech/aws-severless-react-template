import React from 'react'

import { ActivityIndicator, View } from 'react-native'
import {
  Button,
  Toolbar
} from 'react-native-material-ui';

import { Card, Text } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';

import Toast from 'react-native-root-toast';


import { withMuiTheme } from '../Styles/muiTheme';
import Container from '../Components/Container'

class SubmissionToast extends React.Component {
  constructor(props) {
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({
      visible: true
    }), 2);

    setTimeout(() => this.setState({
      visible: false
    }), 3000);
  };

  render() {
    return <Toast
      visible={this.state.visible}
      position={Toast.positions.BOTTOM}
      shadow={false}
      animation={true}
      hideOnPress={true}
      onHidden={this.props.onHidden}
    >Thank you. Your survey was sent.</Toast>;
  }
}

const campaigns = [
  {
    campaignTemplate: {
      id: 1,
      name: "Campaign #1",
      surveyTemplates: {
        items: [
          {
            id: 1,
            name: "Survey #1"
          },
          {
            id: 2,
            name: "Survey #2"
          }
        ]
      }
    },
  },
  {
    campaignTemplate: {
      id: 2,
      name: "Campaign #2",
      surveyTemplates: {
        items: [
          {
            id: 1,
            name: "Survey #1"
          },
          {
            id: 2,
            name: "Survey #2"
          }
        ]
      }
    },
  }
]

const styles = theme => ({
  cardContainer: {
    // padding: theme.spacing.sm,
    // flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.md
  },
  commentButtonContainer: {
    marginTop: theme.spacing.xl
  }
});

class Home extends React.PureComponent {
  static navigationOptions = navigationProps => ({
    header: <Toolbar
      leftElement={
        "menu"
      }
      centerElement={
        "SimpliSurvey"
      }
      rightElement={
        navigationProps.navigation.getParam('valid') ? "send" : null
      }
      onLeftElementPress={() => navigationProps.navigation.toggleDrawer() }
      onRightElementPress={() => navigationProps.navigation.getParam('handleSubmit')() }
    />
  })

  state = {
    selectedCampaignTemplateId: null,
    selectedSurveyTemplateId: null,
    recipientContact: null,
    recipientIdentifier: null,
    submitting: false,
    submitted: false
  }

  _handleSubmit = () =>
    new Promise(resolve => 
      this.setState({submitting: true}, () => resolve())
    )
    .then(() =>
      new Promise(resolve => 
        setTimeout(
          () => this.setState(
            {submitting: false, submitted: true, selectedCampaignTemplateId: null, selectedSurveyTemplateId: null, recipientContact: null, recipientIdentifier: null},
            () => resolve()
          ), 
          3000
        )
      )
    )


  componentDidUpdate() {
    const isValid = !!(
      this.state.selectedCampaignTemplateId &&
      this.state.selectedSurveyTemplateId &&
      this.state.recipientContact &&
      !this.state.submitting);
    const wasValid = this.props.navigation.getParam('valid', false);

    if(isValid !== wasValid) {
      this.props.navigation.setParams({valid: isValid})
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({handleSubmit: this._handleSubmit.bind(this)})
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Card style={{container: classes.cardContainer}}>
          <Text>Fill out the form below to send a survey</Text>
          <Dropdown
            label='Select Campaign'
            data={campaigns.map(campaign => ({value: campaign.campaignTemplate.name, id: campaign.campaignTemplate.id}))}
            onChangeText={(value, index, data) => this.setState({selectedCampaignTemplateId: data[index].id})}
          />
          {
            this.state.selectedCampaignTemplateId &&
            <Dropdown
              label='Select Survey'
              data={
                console.log(campaigns.find(campaign => campaign.campaignTemplate.id === this.state.selectedCampaignTemplateId))
                ||
                campaigns
                  .find(campaign => campaign.campaignTemplate.id === this.state.selectedCampaignTemplateId)
                  .campaignTemplate.surveyTemplates.items.map(surveyTemplate => ({value: surveyTemplate.name, id: surveyTemplate.id}))
              }
              onChangeText={(value, index, data) => this.setState({selectedSurveyTemplateId: data[index].id})}
            />
          }
          {
            this.state.selectedSurveyTemplateId &&
            <TextField
              label='Recipient Contact'
              title='Email address or mobile number to send survey to'
              value={this.state.recipientContact || ''}
              onChangeText={ recipientContact => this.setState({ recipientContact }) }
            />
          }
          {
            this.state.recipientContact &&
            <TextField
              label='Recipient Identifier'
              value={this.state.recipientIdentifier || ''}
              title='(Optional) Name or identifier to indentify the recipient'
              onChangeText={ recipientIdentifier => this.setState({ recipientIdentifier }) }
            />
          }
          <View style={classes.buttonContainer}>
            {
              this.state.submitting ? (
                <ActivityIndicator size="large" />
              ) : this.state.recipientContact ? (
                <Button raised primary text="Send" icon="send" onPress={this._handleSubmit.bind(this)} />
              ) : (
                null
              )
            }
          </View>
          {
            this.state.submitted &&
            <SubmissionToast onHidden={() => this.setState({submitted: false})} />
          }
        </Card>
      </Container>
    )
  }
}

export default withMuiTheme(styles)(Home)