import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Argument } from 'model/arguement.model';

const collection = 'arguments';

@Injectable({
  providedIn: 'root',
})
export class ArgumentService {
  constructor(
    private readonly functions: AngularFireFunctions,
    private readonly db: AngularFirestore
  ) {}

  sendSms(message): Promise<any> {
    const sendSmsRequest = this.functions.httpsCallable('sendSms');
    return sendSmsRequest({
      message: message.message,
      numbers: message.numbers,
    }).toPromise();
  }

  submitArgument(argument: Argument) {
    this.db
      .collection(collection)
      .add(argument)
      .then((response) => {
        const message = {
          message: argument.message.replace(
            '{{link}}',
            `told-ya.com/${response.id}`
          ),
          numbers: argument.numbers,
        };
        this.sendSms(message);
        console.log(response.id);
      });
  }

  getArgument(id: string): Promise<any> {
    return this.db.doc(`arguments/${id}`).get().toPromise();
  }

  castVote(voterId: string, voteTotal: number, docId: string, person) {
    const voter = `voter${voterId}`;
    const votes = `votes${person}`;
    console.log(voter);

    this.db.doc(`${collection}/${docId}`).update({
      [voter]: true,
      [votes]: voteTotal,
    });
  }
}
