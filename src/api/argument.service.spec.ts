import { TestBed } from '@angular/core/testing';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

import { ArgumentService } from './argument.service';

describe('ArgumentService', () => {
  let service: ArgumentService;

  const functionsStub = {
    httpsCallable: jasmine.createSpy('httpsCallable').and.callFake((name: string) => {
      if (name === 'createArgument') {
        return () => of({ argumentId: 'abc123' });
      }

      return () => of(void 0);
    }),
  };

  const firestoreStub = {
    doc: jasmine.createSpy('doc').and.returnValue({
      valueChanges: () => of(undefined),
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArgumentService,
        { provide: AngularFireFunctions, useValue: functionsStub },
        { provide: AngularFirestore, useValue: firestoreStub },
      ],
    });

    service = TestBed.inject(ArgumentService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
