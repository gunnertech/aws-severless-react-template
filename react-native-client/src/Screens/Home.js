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
import { compose, graphql } from 'react-apollo';


import Toast from 'react-native-root-toast';

import CreateSurvey from '../api/Mutations/CreateSurvey';

import { withMuiTheme } from '../Styles/muiTheme';
import withCurrentUser from '../Hocs/withCurrentUser';
import Container from '../Components/Container'

import ENV from '../environment'

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
    selectedCampaignId: null,
    selectedSurveyTemplateId: null,
    recipientContact: null,
    recipientIdentifier: null,
    submitting: false,
    submitted: false
  }

  _sendSms = survey =>
    Auth.currentCredentials()
      .then(credentials =>
        new SNS({
          apiVersion: '2010-12-01',
          credentials: Auth.essentialCredentials(credentials),
          region: "us-east-1"
        })
        .publish({
          Message: `Please take this survey - ${ENV.base_url}/surveys/${survey.id}`,
          PhoneNumber: `+1${survey.recipientContact}`
        })
        .promise()
      )

  _sendEmail = survey =>
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
              'simplisurvey@gunnertech.com',
            ],
            ToAddresses: [
              survey.recipientContact
            ]
          },
          Message: { /* required */
            Body: { /* required */
              Html: {
              Charset: "UTF-8",
              Data: `<html>
                        <body>
                          <a href="${ENV.base_url}/surveys/${survey.id}">Please take this survey</a>
                        </body>
                      </html>`
              },
              Text: {
                Charset: "UTF-8",
                Data: `
                  Please take this survey - ${ENV.base_url}/surveys/${survey.id}
                `
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'SimpliSurvey Invitation'
            }
          },
          Source: 'simplisurvey@gunnertech.com', /* required */ //TODO
          ReplyToAddresses: [
            'simplisurvey@gunnertech.com', //TODO
          ],
        })
        .promise()
      )

  _handleSubmit = () =>
    new Promise(resolve => 
      this.setState({submitting: true}, resolve)
    )
    .then(() =>
      Promise.resolve({
        id: (new Date().getTime()).toString(),
        userId: this.props.currentUser.id,
        campaignId: this.state.selectedCampaignId,
        surveyTemplateId: this.state.selectedSurveyTemplateId,
        recipientContact: this.state.recipientContact,
        recipientIdentifier: this.state.recipientIdentifier || undefined,
        createdAt: (new Date()).toISOString()
      })
    )
    .then(params =>
      this.props.createSurvey({ 
        variables: { 
          ...params,
          __typename: "Survey"
        },
        onError: console.log,
        optimisticResponse: {
          __typename: "Mutation",
          createSurvey: { 
            ...params,
            __typename: "Survey"
          }
        }
      })
    )
    .then(entry =>
      this.state.recipientContact.match(/@/) ? (
        this._sendEmail(entry.data.createSurvey)
      ) : (
        this._sendSms(entry.data.createSurvey)
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

    if(this.props.currentUser && this.props.currentUser.organization.campaigns.items.filter(campaign => !!campaign.active).length === 1 && !this.state.selectedCampaignTemplateId) {
      this.setState({
        selectedCampaignTemplateId: this.props.currentUser.organization.campaigns.items.filter(campaign => !!campaign.active)[0].campaignTemplate.id,
        selectedCampaignId: this.props.currentUser.organization.campaigns.items.filter(campaign => !!campaign.active)[0].id
      })
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
            data={currentUser.organization.campaigns.items.filter(campaign => !!campaign.active).map(campaign => ({value: campaign.campaignTemplate.name, id: campaign.campaignTemplate.id, campaign}))}
            onChangeText={(value, index, data) => this.setState({
              selectedCampaignTemplateId: data[index].id,
              selectedCampaignId: data[index].campaign.id
            })}
            value={
              !!this.state.selectedCampaignTemplateId ? (
                currentUser.organization.campaigns.items
                  .filter(campaign => !!campaign.active)
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
                  .filter(campaign => !!campaign.active)
                  .find(campaign => campaign.campaignTemplate.id === this.state.selectedCampaignTemplateId)
                  .campaignTemplate.surveyTemplates.items.map(surveyTemplate => ({value: surveyTemplate.name, id: surveyTemplate.id}))
              }
              onChangeText={(value, index, data) => this.setState({selectedSurveyTemplateId: data[index].id})}
            />
          }
          {
            this.state.selectedSurveyTemplateId &&
            <TextField
              autoCapitalize={"none"}
              autoCorrect={false}
              label='Recipient Contact'
              title='Email address or mobile number to send survey to'
              value={this.state.recipientContact || ''}
              onChangeText={ recipientContact => this.setState({ recipientContact }) }
            />
          }
          {
            this.state.recipientContact &&
            <TextField
              autoCapitalize={"none"}
              autoCorrect={false}
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
  graphql(CreateSurvey, { name: "createSurvey" }),
  // graphql(UpdateCampaign, { name: "updateCampaign" }),
)(Home);