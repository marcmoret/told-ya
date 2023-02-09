const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid
const authToken = functions.config().twilio.token
const client = new twilio(accountSid, authToken);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   // console.log(accountSid);
//   // console.log(authToken);

//   response.send("Hello from Firebase!");
// });

export const sendSms = functions.https.onRequest((req, res) => {

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
