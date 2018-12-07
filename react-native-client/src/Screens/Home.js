import React from 'react'

import { ActivityIndicator, View } from 'react-native'
import {
  Button,
  Toolbar
} from 'react-native-material-ui';

import SES from 'aws-sdk/clients/ses';
import SNS from 'aws-sdk/clients/sns';
import { Auth } from 'aws-amplify';

import { Card, Text } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import { compose } from 'react-apollo';

import Toast from 'react-native-root-toast';


import { withMuiTheme } from '../Styles/muiTheme';
import withCurrentUser from '../Hocs/withCurrentUser';
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

  _sendSms = (to) =>
    Auth.currentCredentials()
      .then(credentials =>
        new SNS({
          apiVersion: '2010-12-01',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
        .publish({
          Message: `Please take this survey - http://localhost:3000/surveys/${this.state.selectedSurveyTemplateId}`,
          PhoneNumber: '+18609404747'
        })
        .promise()
      )

  _sendEmail = (to) =>
    Auth.currentCredentials()
      .then(credentials =>
        new SES({
          apiVersion: '2010-12-01',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
        .sendEmail({
          Destination: { /* required */
            BccAddresses: [
              'cody@gunnertech.com',
            ],
            ToAddresses: [
              to
            ]
          },
          Message: { /* required */
            Body: { /* required */
              Html: {
              Charset: "UTF-8",
              Data: `<html>
                        <body>
                          <a href="http://localhost:3000/surveys/${this.state.selectedSurveyTemplateId}">Please take this survey</a>
                        </body>
                      </html>`
              },
              Text: {
                Charset: "UTF-8",
                Data: `
                  Please take this survey - http://localhost:3000/surveys/${this.state.selectedSurveyTemplateId}
                `
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'SimpliSurvey Invitation'
            }
          },
          Source: 'cody@gunnertech.com', /* required */
          ReplyToAddresses: [
            'cody@gunnertech.com',
          ],
        })
        .promise()
      )

  _handleSubmit = () =>
    new Promise(resolve => 
      this.setState({submitting: true}, resolve)
    )
    .then(() =>
      this.state.recipientContact.match(/@/) ? (
        this._sendEmail(this.state.recipientContact)
      ) : (
        this._sendSms(this.state.recipientContact)
      )
    )
    .then(() =>
      new Promise(resolve => 
        this.setState(
          {submitting: false, submitted: true, selectedCampaignTemplateId: null, selectedSurveyTemplateId: null, recipientContact: null, recipientIdentifier: null},
          resolve
        )
      )
    )
    .catch(console.log)


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

    if(this.props.currentUser && this.props.currentUser.organization.campaigns.items.length === 1 && !this.state.selectedCampaignTemplateId) {
      this.setState({selectedCampaignTemplateId: this.props.currentUser.organization.campaigns.items[0].campaignTemplate.id})
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({handleSubmit: this._handleSubmit.bind(this)})
  }

  render() {
    const { classes, currentUser } = this.props;
    return !currentUser ? null : (
      <Container>
        <Card style={{container: classes.cardContainer}}>
          <Text>Fill out the form below to send a survey</Text>
          <Dropdown
            label='Select Campaign'
            data={currentUser.organization.campaigns.items.map(campaign => ({value: campaign.campaignTemplate.name, id: campaign.campaignTemplate.id}))}
            onChangeText={(value, index, data) => this.setState({selectedCampaignTemplateId: data[index].id})}
            value={
              !!this.state.selectedCampaignTemplateId ? (
                currentUser.organization.campaigns.items
                  .find(campaign => campaign.campaignTemplate.id === this.state.selectedCampaignTemplateId)
                  .campaignTemplate.name
              ) : (
                ""
              )
              }
          />
          {
            this.state.selectedCampaignTemplateId &&
            <Dropdown
              label='Select Survey'
              data={
                currentUser.organization.campaigns.items
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


export default compose(
  withCurrentUser(),
  withMuiTheme(styles),
  // graphql(CreateCampaign, { name: "createCampaign" }),
  // graphql(UpdateCampaign, { name: "updateCampaign" }),
)(Home);