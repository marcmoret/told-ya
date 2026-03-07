import { Injectable, inject } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom } from 'rxjs';

import { Argument, ArgumentDraft, VoteSide } from '../app/shared/models/argument';

const COLLECTION = 'arguments';

interface CreateArgumentResponse {
  argumentId: string;
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
    const createArgumentRequest = this.functions.httpsCallable<
      ArgumentDraft,
      CreateArgumentResponse
    >('createArgument');
    const response = await firstValueFrom(createArgumentRequest(argument));
    return response.argumentId;
  }

  async castVote(argumentId: string, voterId: string, side: VoteSide): Promise<void> {
    const castVoteRequest = this.functions.httpsCallable<
      { argumentId: string; voterId: string; side: VoteSide },
      void
    >('castVote');
    await firstValueFrom(castVoteRequest({ argumentId, voterId, side }));
  }
}
