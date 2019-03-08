import React from 'react'

import { ActivityIndicator, View, Alert, ScrollView } from 'react-native'
import {
  Button,
  Toolbar,
  Checkbox
} from 'react-native-material-ui';

import SES from 'aws-sdk/clients/ses';
import SNS from 'aws-sdk/clients/sns';
import { Auth } from 'aws-amplify';
import uuid from 'uuid-v4'

import { Card, Text } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import { compose, graphql, Query } from 'react-apollo';
import moment from 'moment';

import Toast from 'react-native-root-toast';

import CreateSurvey from '../api/Mutations/CreateSurvey';
import QueryContactGroupsByOrganizationIdIdIndex from '../api/Queries/QueryContactGroupsByOrganizationIdIdIndex'
import QueryContactsByContactGroupIdIdIndex from '../api/Queries/QueryContactsByContactGroupIdIdIndex'


import { withMuiTheme } from '../Styles/muiTheme';
import withCurrentUser from '../Hocs/withCurrentUser';
import Container from '../Components/Container'
import normalizePhoneNumber from '../Util/normalizePhoneNumber'

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
        !!ENV.bucket.match(/staging/) ? (
          "SimpliSurvey - S"
        ) : (
          "SimpliSurvey"
        )
      }
      rightElement={
        navigationProps.navigation.getParam('valid') ? "send" : null
      }
      onLeftElementPress={() => navigationProps.navigation.toggleDrawer() }
      onRightElementPress={() => navigationProps.navigation.getParam('handleSubmit')() }
    />
  })

  constructor(props) {
    super(props);

    this.state = {
      selectedCampaignTemplateId: null,
      selectedCampaignId: null,
      selectedSurveyTemplateId: null,
      selectedContactGroupId: null,
      recipientContact: null,
      recipientIdentifier: null,
      selectedContacts: [],
      submitting: false,
      submitted: false,
      isAllChecked: false
    }

    this._initialState = this.state;
  }

  _resetState = () =>
    new Promise(resolve => this.setState(this._initialState, resolve))


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
          PhoneNumber: normalizePhoneNumber(survey.recipientContact)
        })
        .promise()
        .then(console.log)
        .catch(console.log)
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
                          <p><a href="${ENV.base_url}/surveys/${survey.id}">Please take this survey</a></p>
                          <p>${ENV.base_url}/surveys/${survey.id}</p>
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
          Source: ENV.bot_email_adress, /* required */
          ReplyToAddresses: [
            ENV.bot_email_adress,
          ],
        })
        .promise()
      )

  _handleSubmit = () =>
    new Promise(resolve => 
      this.setState({submitting: true}, resolve)
    )
    .then(() =>
      Promise.resolve(!!this.state.selectedContacts.length ? (
        this.state.selectedContacts
      ) : (
        [{
          name: this.state.recipientIdentifier || undefined,
          phone: (normalizePhoneNumber(this.state.recipientContact) || undefined),
          email: !!(this.state.recipientContact||"").match(/@/) ? this.state.recipientContact : undefined
        }]
      )
    ))
    .then(contacts =>
      Promise.all(contacts.map(contact => 
        Promise.resolve({
          id: uuid(),
          userId: this.props.currentUser.id,
          campaignId: this.state.selectedCampaignId,
          surveyTemplateId: this.state.selectedSurveyTemplateId,
          recipientContact: contact.phone || contact.email,
          recipientIdentifier: contact.name || undefined,
          createdAt: (new Date()).toISOString()
        })
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
          (entry.data.createSurvey.recipientContact||"").match(/@/) ? (
            this._sendEmail(entry.data.createSurvey)
          ) : !!normalizePhoneNumber(entry.data.createSurvey.recipientContact) ? (
            this._sendSms(entry.data.createSurvey)
          ) : (
            new Promise((resolve, reject) =>
              Alert.alert(
                'Invalid Contact',
                'You must enter a valid email address or Phone number',
                [
                  {text: 'OK', onPress: reject},
                ],
                {cancelable: false},
              )
            )
          )
        )
      ))
    )
    .then(this._resetState)
    .catch(console.log)


  componentDidUpdate(prevProps, prevState, snapshot) {
    const isValid = !!(
      this.state.selectedCampaignTemplateId &&
      this.state.selectedSurveyTemplateId &&
      this.state.recipientContact &&
      !this.state.submitting);
    const wasValid = this.props.navigation.getParam('valid', false);

    if(isValid !== wasValid) {
      this.props.navigation.setParams({valid: isValid})
    }

    if(!!this.state.selectedCampaignTemplateId && !prevState.selectedCampaignTemplateId) {
      this.setState({
        selectedSurveyTemplateId: this.props.currentUser.organization.campaigns.items
          .filter(campaign => !!campaign.active)
          .find(campaign => campaign.campaignTemplate.id === this.state.selectedCampaignTemplateId)
          .campaignTemplate.surveyTemplates.items[0].id
      })
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
    const { isAllChecked, submitted, submitting, selectedCampaignTemplateId, selectedCampaignId, selectedSurveyTemplateId, selectedContacts, selectedContactGroupId, recipientContact, recipientIdentifier } = this.state;
    return !currentUser ? null : (
      <Container>
        <ScrollView>

        <Card style={{container: classes.cardContainer}}>
          <View>
            { ///If the signed up less than two minutes ago, show them a welcome message
              moment.duration(
                moment(currentUser.createdAt).diff(
                  new moment()
                )
              ).asMinutes() < 2 && currentUser.organization.ownerId !== currentUser.id ? (
                <Text>Success! You joined {currentUser.organization.name}</Text>
              ) : (
                null
              )
            }
            <Text>Fill out the form below to send a survey</Text>
            <Dropdown
              label='Select Campaign'
              data={currentUser.organization.campaigns.items.filter(campaign => !!campaign.active).map(campaign => ({value: campaign.campaignTemplate.name, id: campaign.campaignTemplate.id, campaign}))}
              onChangeText={(value, index, data) => this.setState({
                selectedCampaignTemplateId: data[index].id,
                selectedCampaignId: data[index].campaign.id
              })}
              value={
                !!selectedCampaignTemplateId ? (
                  currentUser.organization.campaigns.items
                    .filter(campaign => !!campaign.active)
                    .find(campaign => campaign.campaignTemplate.id === selectedCampaignTemplateId)
                    .campaignTemplate.name
                ) : (
                  ""
                )
                }
            />
            {
              selectedCampaignTemplateId &&
              <Dropdown
                label='Select Survey'
                value={
                  currentUser.organization.campaigns.items
                    .filter(campaign => !!campaign.active)
                    .find(campaign => campaign.campaignTemplate.id === selectedCampaignTemplateId)
                    .campaignTemplate.surveyTemplates.items[0].name
                }
                data={
                  currentUser.organization.campaigns.items
                    .filter(campaign => !!campaign.active)
                    .find(campaign => campaign.campaignTemplate.id === selectedCampaignTemplateId)
                    .campaignTemplate.surveyTemplates.items.map(surveyTemplate => ({value: surveyTemplate.name, id: surveyTemplate.id}))
                }
                onChangeText={(value, index, data) => this.setState({selectedSurveyTemplateId: data[index].id})}
              />
            }
            {
              !!selectedSurveyTemplateId &&
              !selectedContacts.length &&
              <TextField
                autoCapitalize={"none"}
                autoCorrect={false}
                label='Enter Contact Info or Select from Below'
                title='Email address or mobile number to send survey to'
                value={recipientContact || ''}
                onChangeText={ recipientContact => this.setState({ recipientContact, selectedContacts: [] }) }
              />
            }
            {
              !!recipientContact &&
              <TextField
                autoCapitalize={"none"}
                autoCorrect={false}
                label='Recipient Identifier'
                value={recipientIdentifier || ''}
                title='(Optional) Name or identifier to indentify the recipient'
                onChangeText={ recipientIdentifier => this.setState({ recipientIdentifier }) }
              />
            }
            {
              !recipientContact && 
              <Query
                query={QueryContactGroupsByOrganizationIdIdIndex}
                variables={{first: 1000, organizationId: currentUser.organizationId}}
              >
                {({loading, error, data: {queryContactGroupsByOrganizationIdIdIndex: {items} = {items: []}} = {}}) => 
                  !!items.length && 
                  !!selectedSurveyTemplateId && 
                  <Dropdown
                    label='Select Contact Group'
                    value={
                      ""
                    }
                    data={[
                      ...items.map(contactGroup => ({value: contactGroup.name, id: contactGroup.id}))
                    ]}
                    onChangeText={(value, index, data) => this.setState({selectedContactGroupId: data[index].id})}
                  />
                }
              </Query>
            }
            {
              !!selectedContactGroupId &&
              <Query
                query={QueryContactsByContactGroupIdIdIndex}
                variables={{first: 1000, contactGroupId: selectedContactGroupId}}
              >
                {({loading, error, data: {queryContactsByContactGroupIdIdIndex: {items} = {items: []}} = {}}) => 
                  items.map((contact, i) =>
                    <View key={contact.id}>
                      {
                        i === 0 &&
                        <Checkbox
                          label={"All"}
                          value={`all`}
                          checked={isAllChecked}
                          onCheck={(checked, value) => this.setState({isAllChecked: checked}, () => checked ? (
                            this.setState({selectedContacts: items})
                          ) : (
                            this.setState({selectedContacts: []})
                          ))}
                        />
                      }
                      <Checkbox
                        label={contact.name}
                        value={contact.id}
                        checked={!!selectedContacts.find(c => contact.id === c.id)}
                        onCheck={(checked, value) => 
                          checked ? (
                            this.setState({
                              selectedContacts:[
                                ...items.filter(contact => contact.id === value),
                                ...selectedContacts
                              ],
                              recipientContact: null
                            }) 
                          ) : (
                            this.setState({
                              selectedContacts: selectedContacts.filter(contact => contact.id !== value)
                            }) 
                          )
                        }
                      />
                    </View>
                  )
                }
              </Query>
            }
            
            <View style={classes.buttonContainer}>
              {
                submitting ? (
                  <ActivityIndicator size="large" />
                ) : recipientContact || !!selectedContacts.length ? (
                  <Button raised primary text="Send" icon="send" onPress={this._handleSubmit.bind(this)} />
                ) : (
                  null
                )
              }
            </View>
            {
              submitted &&
              <SubmissionToast onHidden={() => this.setState({submitted: false})} />
            }
          </View>
        </Card>
        </ScrollView>
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
