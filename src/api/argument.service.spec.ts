import { TestBed } from '@angular/core/testing';

import { ArgumentService } from './argument.service';

describe('ArguementService', () => {
  let service: ArgumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArgumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
