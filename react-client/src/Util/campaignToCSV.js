
import { convertArrayToCSV } from "convert-array-to-csv";

const campaignToCSV = (campaign, surveys, users) =>
  Promise.resolve(["Campaign", "Survey", "Prompt", "Response", "Comments", 'Reviewer Name', 'Reviewer Email', 'Reviewed At', 'Reviewer Comments', "Sender's Name", "Sender's Email", "Respondent", "Date"])
    .then(header => ({
      header,
      data: surveys
        // .filter(survey => !!survey.responses.items[0])
        .map(survey => ({
          survey, 
          selectedPrompt: survey.responses.items[0] && survey.surveyTemplate.prompts.items.find(prompt => 
            prompt.options.items.find(option => 
              option.id === survey.responses.items[0].optionId
            )
          ),
          selectedOption: survey.responses.items[0] && survey.surveyTemplate.prompts.items.map(prompt => 
            prompt.options.items.find(option => 
              option.id === survey.responses.items[0].optionId
            )
          )
          .filter(option => !!option)[0],
          response: survey.responses.items[0]
        }))
        .map(({survey, selectedPrompt={}, selectedOption={}, response={}}) => (
        [
          campaign.campaignTemplate.name, ///Campaign
          survey.surveyTemplate.name,  //Survey
          selectedPrompt.body, //Prompt
          selectedOption.name, //Response
          response.reason, ////Comments
          (users.find(user => user.id === response.reviewerId) || {}).name, /// Review Name
          (users.find(user => user.id === response.reviewerId) || {}).email, /// Review Email
          response.reviewedAt, /// Reviewed At
          response.reviewComment, /// Reviewer Comments
          users.find(user => user.id === survey.userId).name, //Sender's Name
          users.find(user => user.id === survey.userId).email, ///Sender's Email
          `${survey.recipientContact} - ${survey.recipientIdentifier}`, ///Respondent
          survey.createdAt //Date
        ]
      ))
    })
  )
  .then(({header, data}) => 
    convertArrayToCSV(data, {
      header,
      separator: ','
    })
  )

export default campaignToCSV;