import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Argument } from 'model/arguement.model';
import { firstValueFrom } from 'rxjs';

const collection = 'arguments';

@Injectable({
  providedIn: 'root',
})
export class ArgumentService {
  constructor(
    private readonly functions: AngularFireFunctions,
    private readonly db: AngularFirestore
  ) { }

  sendSms(message) {
    const sendSmsRequest = this.functions.httpsCallable('sendSms');
    firstValueFrom(sendSmsRequest({
      message: message.message,
      numbers: message.numbers,
    }));
  }

  async submitArgument(argument: Argument) {
    let id = '';
    await this.db
      .collection(collection)
      .add(argument)
      .then((response) => {
        const message = {
          message: argument.message.replace(
            '{{link}}',
            `https://toldya.ca/argument/${response.id}`
          ),
          numbers: argument.numbers,
        };
        this.sendSms(message);
        id = response.id;
      });
    return id;
  }

  getArgument(id: string): Promise<any> {
    return firstValueFrom(this.db.doc(`arguments/${id}`).get());
  }

  async castVote(voterId: string, voteTotal: number, docId: string, person) {
    const voter = `voter${voterId}`;
    const votes = `votes${person}`;

    return this.db.doc(`${collection}/${docId}`).update({
      [voter]: true,
      [votes]: voteTotal,
    });
  }

  async verifyVoter(id: string, voterId: string) {
    let result;
    const docRef = this.db.doc(`${collection}/${id}`).get();

    await firstValueFrom(docRef).then((documentSnap) => {
      result = documentSnap.data();
      console.log(documentSnap.data());
    });
    return result;
  }
}
