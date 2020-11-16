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

  async submitArgument(argument: Argument) {
    let id = '';
    await this.db
      .collection(collection)
      .add(argument)
      .then((response) => {
        const message = {
          message: argument.message.replace(
            '{{link}}',
            `https://told-ya.web.app/argument/${response.id}`
          ),
          numbers: argument.numbers,
        };
        this.sendSms(message);
        id = response.id;
        console.log(response.id);
      });
    return id;
  }

  getArgument(id: string): Promise<any> {
    return this.db.doc(`arguments/${id}`).get().toPromise();
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

    await docRef.toPromise().then((documentSnap) => {
      result = documentSnap.data();
      console.log(documentSnap.data());
    });
    return result;
  }
}
