
import { convertArrayToCSV } from "convert-array-to-csv";

if (!Array.prototype.flat) {
	Object.defineProperties(Array.prototype, {
		flat: {
			configurable: true,
			value: function flat() {
				let depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
				const stack = Array.prototype.slice.call(this);
				const result = [];

				while (depth && stack.length) {
					const next = stack.pop();

					if (Object(next) instanceof Array) {
						--depth;

						Array.prototype.push.apply(stack, next);
					} else {
						result.unshift(next);
					}
				}

				return result.concat(stack);
			},
			writable: true
		},
		flatMap: {
			configurable: true,
			value: function flatMap(callback) {
				return Array.prototype.map.apply(this, arguments).flat();
			},
			writable: true
		}
	});
}

const campaignToCSV = (campaign, surveys, users) =>
  Promise.resolve(["Campaign", "Survey", "Prompt", "Response", "Comments", 'Reviewer Name', 'Reviewer Email', 'Reviewed At (UTC -5)', 'Reviewer Comments', "Sender's Name", "Sender's Email", "Respondent", "Date (UTC -5)"])
    .then(header => ({
      header,
      data: surveys
        // .filter(survey => !!survey.responses.items[0])
        .map(survey => 
          survey.surveyTemplate.prompts.items
            .map(prompt => ({
              prompt,
              selectedOption: prompt.options.items.find(option => 
                  !!survey.responses.items.find(response => option.id === response.optionId)
                )
            }))
            .map(({prompt, selectedOption={}}) => console.log({prompt, selectedOption}) || ({
              survey, 
              prompt,
              selectedOption,
              response: survey.responses.items.find(response => 
                response.optionId === selectedOption.id
              )
            }))
            .map(({survey, prompt, selectedOption={}, response={}}) => console.log(survey, prompt, selectedOption, response) || ([
              campaign.campaignTemplate.name, ///Campaign
              survey.surveyTemplate.name,  //Survey
              prompt.body, //Prompt
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
            ])
          )
      )
      .flat()
    })
  )
  .then(({header, data}) => 
    convertArrayToCSV(data, {
      header,
      separator: ','
    })
  )

export default campaignToCSV;