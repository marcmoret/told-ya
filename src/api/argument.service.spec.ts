import { TestBed } from '@angular/core/testing';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

import { ArgumentService } from './argument.service';

describe('ArgumentService', () => {
  let service: ArgumentService;

  const functionsStub = {
    httpsCallable: jasmine
      .createSpy('httpsCallable')
      .and.returnValue(() => of({ sent: 1, failed: 0 })),
  };

  const firestoreStub = {
    doc: jasmine.createSpy('doc').and.returnValue({
      valueChanges: () => of(undefined),
      ref: {},
    }),
    collection: jasmine.createSpy('collection').and.returnValue({
      add: jasmine.createSpy('add').and.resolveTo({ id: 'abc123' }),
    }),
    firestore: {
      runTransaction: jasmine.createSpy('runTransaction').and.resolveTo(undefined),
    },
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
