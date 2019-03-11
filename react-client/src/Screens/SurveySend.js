import React from 'react'


import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';



import SES from 'aws-sdk/clients/ses';
import SNS from 'aws-sdk/clients/sns';
import { Auth } from 'aws-amplify';
import uuid from 'uuid-v4'

import { compose, graphql, Query } from 'react-apollo';



import CreateSurvey from '../api/Mutations/CreateSurvey';
import QueryContactGroupsByOrganizationIdIdIndex from '../api/Queries/QueryContactGroupsByOrganizationIdIdIndex'
import QueryContactsByContactGroupIdIdIndex from '../api/Queries/QueryContactsByContactGroupIdIdIndex'


import withCurrentUser from '../Hocs/withCurrentUser';
import Container from '../Components/Container'
import normalizePhoneNumber from '../Util/normalizePhoneNumber'


const Text = ({children, ...rest}) =>
  <p {...rest}>{children}</p>

const View = ({children, ...rest}) =>
  <div {...rest}>{children}</div>




const styles = theme => ({
  cardContainer: {
    padding: theme.spacing.unit,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2,
    minWidth: 120,
    flex: 1
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid gray'
  },
  commentButtonContainer: {
    marginTop: theme.spacing.xl
  }
});

class SurveySend extends React.PureComponent {
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
          Message: `Please take this survey - ${process.env.REACT_APP_base_url}/surveys/${survey.id}`,
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
                          <p><a href="${process.env.REACT_APP_base_url}/surveys/${survey.id}">Please take this survey</a></p>
                          <p>${process.env.REACT_APP_base_url}/surveys/${survey.id}</p>
                        </body>
                      </html>`
              },
              Text: {
                Charset: "UTF-8",
                Data: `
                  Please take this survey - ${process.env.REACT_APP_base_url}/surveys/${survey.id}
                `
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: 'SimpliSurvey Invitation'
            }
          },
          Source: process.env.REACT_APP_bot_email_adress, /* required */
          ReplyToAddresses: [
            process.env.REACT_APP_bot_email_adress,
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
              window.alert(
                'You must enter a valid email address or Phone number',
              ) || reject('You must enter a valid email address or Phone number')
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


  render() {
    const { classes, currentUser } = this.props;
    const { isAllChecked, submitted, submitting, selectedCampaignTemplateId, selectedCampaignId, selectedSurveyTemplateId, selectedContacts, selectedContactGroupId, recipientContact, recipientIdentifier } = this.state;
    return !currentUser ? null : (
      <Container>
        <Card className={classes.cardContainer}>
          <Text>Fill out the form below to send a survey</Text>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Select Campaign</InputLabel>
            <Select
              fullWidth
              onChange={event => this.setState({
                selectedCampaignTemplateId: currentUser.organization.campaigns.items.find(campaign => campaign.id === event.target.value).campaignTemplate.id,
                selectedCampaignId: event.target.value
              })}
              value={
                !!selectedCampaignTemplateId ? (
                  currentUser.organization.campaigns.items
                    .filter(campaign => !!campaign.active)
                    .find(campaign => campaign.campaignTemplate.id === selectedCampaignTemplateId)
                    .id
                ) : (
                  ""
                )
                }
            >
              {
                currentUser.organization.campaigns.items.filter(campaign => !!campaign.active).map(campaign => 
                  <MenuItem key={campaign.id} value={campaign.id}>{campaign.campaignTemplate.name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          {
            selectedCampaignTemplateId &&
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Select Survey</InputLabel>
              <Select
                value={
                  currentUser.organization.campaigns.items
                    .filter(campaign => !!campaign.active)
                    .find(campaign => campaign.campaignTemplate.id === selectedCampaignTemplateId)
                    .campaignTemplate.surveyTemplates.items[0].id
                }

                onChange={event => this.setState({selectedSurveyTemplateId: event.target.value})}
              >
                {
                  currentUser.organization.campaigns.items
                    .filter(campaign => !!campaign.active)
                    .find(campaign => campaign.campaignTemplate.id === selectedCampaignTemplateId)
                    .campaignTemplate.surveyTemplates.items.map(surveyTemplate =>
                      <MenuItem key={surveyTemplate.id} value={surveyTemplate.id}>{surveyTemplate.name}</MenuItem>
                    )
                }
              </Select>
            </FormControl>
          }
          {
            !!selectedSurveyTemplateId &&
            !selectedContacts.length &&
            <TextField
              className={classes.formControl}
              fullWidth
              label="Enter Contact Info or Select from Below"
              placeholder='Email address or mobile number to send survey to'
              className={classes.textField}
              value={recipientContact || ''}
              onChange={ event => this.setState({ recipientContact: event.target.value, selectedContacts: [] }) }
              margin="normal"
            />
          }
          {
            !!recipientContact &&
            <TextField
              className={classes.formControl}
              fullWidth
              label="Recipient Identifier"
              placeholder='(Optional) Name or identifier to indentify the recipient'
              className={classes.textField}
              value={recipientIdentifier || ''}
              onChange={ event => this.setState({ recipientIdentifier: event.target.value }) }
              margin="normal"
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
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-simple">Select Contact Group</InputLabel>
                  <Select
                    value={selectedContactGroupId||""}
                    onChange={event => this.setState({selectedContactGroupId: event.target.value})}
                  >
                    {
                      items.map(contactGroup => 
                        <MenuItem key={contactGroup.id} value={contactGroup.id}>{contactGroup.name}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
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
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={`all`}
                        checked={isAllChecked}
                        onChange={event => this.setState({isAllChecked: event.target.checked, selectedContacts: event.target.checked ? items : []})}
                      />
                    }
                    label="All"
                  />
                  {
                    items.map(contact =>
                      <FormControlLabel
                        key={contact.id}
                        control={
                          <Checkbox
                            value={contact.id}
                            checked={!!selectedContacts.find(c => contact.id === c.id)}
                            onChange={event => 
                              event.currentTarget.checked ? (
                                this.setState({
                                  selectedContacts:[
                                    ...items.filter(contact => contact.id === event.currentTarget.value),
                                    ...selectedContacts
                                  ],
                                  recipientContact: null
                                }) 
                              ) : (
                                this.setState({
                                  selectedContacts: selectedContacts.filter(contact => contact.id !== event.currentTarget.value)
                                }) 
                              )
                            }
                          />
                        }
                        label={contact.name}
                      />
                    )
                  }
                </FormGroup>
              }
            </Query>
          }

          {
            (submitting ||
            recipientContact || 
            !!selectedContacts.length) &&
            <View className={classes.buttonContainer}>
              {
                submitting ? (
                  <CircularProgress className={classes.progress} />
                ) : recipientContact || !!selectedContacts.length ? (
                  <Button onClick={this._handleSubmit} variant="contained" color="primary" className={classes.button}>
                    Send
                    <SendIcon className={classes.rightIcon} />
                  </Button>
                ) : (
                  null
                )
              }
            </View>
          }
        </Card>
      </Container>
    )
  }
}


export default compose(
  withCurrentUser(),
  withStyles(styles),
  graphql(CreateSurvey, { name: "createSurvey" }),
)(SurveySend);
