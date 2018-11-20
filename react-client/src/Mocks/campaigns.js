import options from './options';

const campaigns = [
  {
    id: '1',
    active: true,
    campaignTemplate: {
      id: "1",
      name: "Campaign #1",
      surveyTemplates: {
        items: [
          {
            id: "1",
            name: "Survey #1",
            prompts: {
              items: [{
                id: "1",
                body: "Rate your experience",
                position: 1,
                options: {
                  items: options
                }
              }]
            }
          }
        ]
      }
    },
  },
  {
    id: '2',
    active: false,
    campaignTemplate: {
      id: "2",
      name: "Campaign #2",
      surveyTemplates: {
        items: [
          {
            id: "1",
            name: "Survey #1",
            prompts: {
              items: [{
                id: "1",
                body: "Rate your happiness",
                position: 1,
                options: {
                  items: options
                }
              }]
            }
          },
          {
            id: "2",
            name: "Survey #2",
            prompts: {
              items: [{
                id: "2",
                body: "Rate our service",
                position: 2,
                options: {
                  items: options
                }
              }]
            }
          }
        ]
      }
    },
  }
]

export default campaigns