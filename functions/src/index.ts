import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';

admin.initializeApp();

const db = admin.firestore();
const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = twilio(accountSid, authToken);
const COLLECTION = 'arguments';
const MAX_CONTACTS = 8;

type VoteSide = 'A' | 'B';
type VoteCountKey = 'votesA' | 'votesB';
type VoterFlagKey = `voter${number}`;

interface ArgumentRecord {
  topic: string;
  personA: string;
  personB: string;
  argumentA: string;
  argumentB: string;
  votesA: number;
  votesB: number;
  numbers: string[];
  shareMessageTemplate: string;
  createdDate: Date;
  [key: VoterFlagKey]: boolean | undefined;
}

interface SmsRecipient {
  message: string;
  number: string;
}

interface CreateArgumentPayload {
  topic?: string;
  personA?: string;
  personB?: string;
  argumentA?: string;
  argumentB?: string;
  numbers?: string[];
  shareMessageTemplate?: string;
  createdDate?: string | Date | admin.firestore.Timestamp;
  [key: VoterFlagKey]: boolean | string | undefined;
}

interface CastVotePayload {
  argumentId?: string;
  voterId?: string;
  side?: VoteSide;
}

function sanitizeSingleLine(value: string | undefined, field: string, maxLength: number): string {
  const normalized = (value ?? '').replace(/\s+/g, ' ').trim();

  if (!normalized || normalized.length > maxLength) {
    throw new functions.https.HttpsError('invalid-argument', `Invalid ${field}.`);
  }

  return normalized;
}

function sanitizeParagraphs(value: string | undefined, field: string, maxLength: number): string {
  const normalized = (value ?? '').replace(/\r\n/g, '\n').trim().replace(/\n{3,}/g, '\n\n');

  if (!normalized || normalized.length > maxLength) {
    throw new functions.https.HttpsError('invalid-argument', `Invalid ${field}.`);
  }

  return normalized;
}

function normalizePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  throw new functions.https.HttpsError('invalid-argument', 'Invalid phone number.');
}

function getVoterKey(voterId: string): VoterFlagKey {
  return `voter${voterId}` as VoterFlagKey;
}

function getVoteCountKey(side: VoteSide): VoteCountKey {
  return side === 'A' ? 'votesA' : 'votesB';
}

function isValidVoterId(numbers: string[], voterId: string): boolean {
  if (!/^\d+$/.test(voterId)) {
    return false;
  }

  if (voterId === '0') {
    return true;
  }

  const numericVoterId = Number(voterId);
  return numericVoterId >= 1 && numericVoterId <= numbers.length;
}

function buildRecipients(argumentId: string, argument: ArgumentRecord): SmsRecipient[] {
  return argument.numbers.map((number, index) => ({
    number,
    message: argument.shareMessageTemplate.replace(
      '{{link}}',
      `https://toldya.ca/argument/${argumentId}/${index + 1}`
    ),
  }));
}

async function sendSmsMessages(recipients: SmsRecipient[]): Promise<void> {
  await Promise.all(
    recipients.map(async ({ message, number }) => {
      try {
        await client.messages.create({
          body: message,
          from: '+14256001653',
          to: number,
        });
      } catch (error) {
        functions.logger.error('Failed to send SMS message.', {
          error,
          number,
        });
      }
    })
  );
}

function parseCreateArgumentPayload(data: CreateArgumentPayload): ArgumentRecord {
  const numbers = Array.isArray(data?.numbers) ? data.numbers.map(normalizePhoneNumber) : [];

  if (numbers.length < 1 || numbers.length > MAX_CONTACTS) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid number of voters.');
  }

  if (numbers.length !== new Set(numbers).size) {
    throw new functions.https.HttpsError('invalid-argument', 'Duplicate voter numbers are not allowed.');
  }

  const argument: ArgumentRecord = {
    topic: sanitizeSingleLine(data.topic, 'topic', 120),
    personA: sanitizeSingleLine(data.personA, 'personA', 40),
    personB: sanitizeSingleLine(data.personB, 'personB', 40),
    argumentA: sanitizeParagraphs(data.argumentA, 'argumentA', 600),
    argumentB: sanitizeParagraphs(data.argumentB, 'argumentB', 600),
    votesA: 0,
    votesB: 0,
    numbers,
    shareMessageTemplate: sanitizeParagraphs(
      data.shareMessageTemplate,
      'shareMessageTemplate',
      240
    ),
    createdDate: new Date(),
  };

  argument[getVoterKey('0')] = true;
  numbers.forEach((_, index) => {
    argument[getVoterKey(String(index + 1))] = false;
  });

  return argument;
}

export const createArgument = functions.https.onCall(async (data: CreateArgumentPayload) => {
  const argument = parseCreateArgumentPayload(data);
  const documentReference = await db.collection(COLLECTION).add(argument);
  await sendSmsMessages(buildRecipients(documentReference.id, argument));

  return {
    argumentId: documentReference.id,
  };
});

export const castVote = functions.https.onCall(async (data: CastVotePayload) => {
  const argumentId = (data?.argumentId ?? '').trim();
  const voterId = (data?.voterId ?? '').trim();
  const side = data?.side;

  if (!argumentId || !voterId || (side !== 'A' && side !== 'B')) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid vote payload.');
  }

  const documentReference = db.collection(COLLECTION).doc(argumentId);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(documentReference);

    if (!snapshot.exists) {
      throw new functions.https.HttpsError('not-found', 'Argument not found.');
    }

    const argument = snapshot.data() as ArgumentRecord;

    if (!isValidVoterId(argument.numbers, voterId)) {
      throw new functions.https.HttpsError('permission-denied', 'Invalid voter.');
    }

    const voterKey = getVoterKey(voterId);

    if (argument[voterKey]) {
      return;
    }

    const voteCountKey = getVoteCountKey(side);
    transaction.update(documentReference, {
      [voterKey]: true,
      [voteCountKey]: (argument[voteCountKey] ?? 0) + 1,
    });
  });
});
