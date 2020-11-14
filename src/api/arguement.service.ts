import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Argument } from 'model/arguement.model';

@Injectable({
  providedIn: 'root',
})
export class ArguementService {
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
      .collection('arguments')
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
}
