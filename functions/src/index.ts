const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const client = require('twilio')(
  functions.config().twilio.sid,
  functions.config().twilio.token
);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const sendSms = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const data = req.body.data;
    const message = data.message;
    const numbers = data.numbers;

    const results = [];

    for (const number of numbers) {
      await client.messages
        .create({
          body: message,
          from: '+14387943264',
          to: number,
        })
        .then((respo) => {
          results.push(respo);
        })
        .catch((err) => {
          results.push(err);
        });
    }

    return res.status(200).send({ data: results }).end();
  });
});
