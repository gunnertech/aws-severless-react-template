
import { convertArrayToCSV } from "convert-array-to-csv";

const campaignToCSV = (campaign, surveys, users) =>
  Promise.resolve(["Campaign", "Survey", "Prompt", "Response", "User", "Respondent", "Date"])
    .then(header => ({
      header,
      data: surveys
        .filter(survey => !!survey.responses.items[0])
        .map(survey => (
        [
          campaign.campaignTemplate.name, 
          survey.surveyTemplate.name, 
          survey.surveyTemplate.prompts.items.find(prompt => 
            prompt.options.items.find(option => 
              option.id === survey.responses.items[0].optionId
            )
          )
          .body,
          survey.surveyTemplate.prompts.items.map(prompt => 
            prompt.options.items.find(option => 
              option.id === survey.responses.items[0].optionId
            )
          )
          .find(option => !!option)
          .name,
          users.find(user => user.id === survey.userId).name,
          `${survey.recipientContact} - ${survey.recipientIdentifier}`,
          survey.createdAt
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