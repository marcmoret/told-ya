import * as functions from 'firebase-functions/v1';

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = twilio(accountSid, authToken);

interface SmsRecipient {
  message: string;
  number: string;
}

interface SendSmsPayload {
  recipients?: SmsRecipient[];
}

export const sendSms = functions.https.onCall(
  async (data: SendSmsPayload) => {
    const recipients = Array.isArray(data?.recipients) ? data.recipients : [];

    if (recipients.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'At least one recipient is required.'
      );
    }

    const results = await Promise.all(
      recipients.map(async ({ message, number }) => {
        try {
          await client.messages.create({
            body: message,
            from: '+14256001653',
            to: number,
          });
          return true;
        } catch (error) {
          functions.logger.error('Failed to send SMS message.', {
            error,
            number,
          });
          return false;
        }
      })
    );

    const sent = results.filter(Boolean).length;
    return {
      sent,
      failed: results.length - sent,
    };
  }
);
