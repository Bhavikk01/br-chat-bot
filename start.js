const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(
  bodyParser.urlencoded({extended: false})
);
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

app.post('/send-msg', (req, res) => {
  console.log(req.body.MSG);
  runSample(req.body.MSG).then((message) => {
    res.send({
      Reply: message
    }); 
  });
});

const sessionId = uuid.v4();

async function runSample(inputMessage, projectId = 'br-bot-tbct') {

  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './br-bot-tbct-c906a59f944b.json'
  });

  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: inputMessage,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log('  No intent matched.');
  }

  return result.fulfillmentText;
}


app.listen(5000, () => console.log('Running on port 5000'));