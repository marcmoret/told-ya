import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ArgumentService } from '../../api/argument.service';
import { Argument } from '../shared/models/argument';
import { VotingComponent } from './voting.component';

describe('VotingComponent', () => {
  let component: VotingComponent;
  let fixture: ComponentFixture<VotingComponent>;

  const argument: Argument = {
    topic: 'Best breakfast?',
    personA: 'Jamie',
    personB: 'Taylor',
    argumentA: 'Eggs and toast.',
    argumentB: 'Pancakes and fruit.',
    votesA: 3,
    votesB: 2,
    numbers: ['+14165550123'],
    shareMessageTemplate: 'Vote here: {{link}}',
    createdDate: new Date(),
    voter0: true,
    voter1: false,
  };

  const argumentServiceStub = {
    watchArgument: jasmine.createSpy('watchArgument').and.returnValue(of(argument)),
    castVote: jasmine.createSpy('castVote').and.resolveTo(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingComponent],
      providers: [
        { provide: ArgumentService, useValue: argumentServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                argumentId: 'abc123',
                voterId: '0',
              }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
