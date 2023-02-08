const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const client = require('twilio')(
  functions.config().twilio.sid,
  functions.config().twilio.token
);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const sendSms = functions.https.onRequest((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", '*');
  res.setHeader("Access-Control-Allow-Credentials","true");
  res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-xsrf-token, X-Requested-With, Accept, Expires, Last-Modified, Cache-Control");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  cors(req, res, async () => {  
  
    const data = req.body.data;
    const message = data.message;
    const numbers = data.numbers;

    const results = [];
    let msgCounter = 0;

    for (const number of numbers) {
      msgCounter++;
      await client.messages
        .create({
          body: `${message}${msgCounter}`,
          from: '+14256001653',
          to: number,
        })
        .then((respo) => {
          results.push(respo);
        })
        .catch((err) => {
          console.log('Error: ' + err)
          results.push(err);
        });
    }

    return res.status(200).send({ data: results }).end();
  });
});
