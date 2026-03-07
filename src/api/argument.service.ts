import { Injectable, inject } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom } from 'rxjs';

import { environment } from '../environments/environment';
import {
  Argument,
  ArgumentDraft,
  VoteSide,
  getVoteCountKey,
  getVoterKey,
} from '../app/shared/models/argument';

const COLLECTION = 'arguments';

interface SmsRecipient {
  number: string;
  message: string;
}

interface SendSmsRequest {
  recipients: SmsRecipient[];
}

interface SendSmsResponse {
  sent: number;
  failed: number;
}

@Injectable({
  providedIn: 'root',
})
export class ArgumentService {
  private readonly functions = inject(AngularFireFunctions);
  private readonly db = inject(AngularFirestore);

  watchArgument(id: string): Observable<Argument | undefined> {
    return this.db.doc<Argument>(`${COLLECTION}/${id}`).valueChanges();
  }

  async submitArgument(argument: ArgumentDraft): Promise<string> {
    const documentReference = await this.db
      .collection<ArgumentDraft>(COLLECTION)
      .add(argument);

    await this.sendSms(
      argument.numbers.map((number, index) => ({
        number,
        message: argument.shareMessageTemplate.replace(
          '{{link}}',
          `${environment.appUrl}/argument/${documentReference.id}/${index + 1}`
        ),
      }))
    );

    return documentReference.id;
  }

  async castVote(argumentId: string, voterId: string, side: VoteSide): Promise<void> {
    const documentReference = this.db.doc<Argument>(`${COLLECTION}/${argumentId}`).ref;

    await this.db.firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(documentReference);

      if (!snapshot.exists) {
        throw new Error('Argument not found.');
      }

      const argument = snapshot.data() as Argument;
      const voterKey = getVoterKey(voterId);

      if (argument[voterKey]) {
        return;
      }

      const voteCountKey = getVoteCountKey(side);
      const nextVoteTotal = argument[voteCountKey] + 1;

      transaction.update(documentReference, {
        [voterKey]: true,
        [voteCountKey]: nextVoteTotal,
      });
    });
  }

  private async sendSms(recipients: SmsRecipient[]): Promise<SendSmsResponse> {
    const sendSmsRequest = this.functions.httpsCallable<SendSmsRequest, SendSmsResponse>('sendSms');
    return firstValueFrom(sendSmsRequest({ recipients }));
  }
}
