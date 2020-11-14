import { TestBed } from '@angular/core/testing';

import { ArguementService } from './arguement.service';

describe('ArguementService', () => {
  let service: ArguementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArguementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
