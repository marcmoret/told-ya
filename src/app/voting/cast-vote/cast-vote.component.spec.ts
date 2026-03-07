import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentService } from '../../../api/argument.service';
import { Argument } from '../../shared/models/argument';
import { CastVoteComponent } from './cast-vote.component';

describe('CastVoteComponent', () => {
  let component: CastVoteComponent;
  let fixture: ComponentFixture<CastVoteComponent>;

  const argumentServiceSpy = jasmine.createSpyObj<ArgumentService>('ArgumentService', ['castVote']);
  const argument: Argument = {
    topic: 'Best pizza topping?',
    personA: 'Jamie',
    personB: 'Taylor',
    argumentA: 'Pepperoni keeps it classic.',
    argumentB: 'Mushroom is better balanced.',
    votesA: 1,
    votesB: 2,
    numbers: ['+14165550123'],
    shareMessageTemplate: 'Vote here: {{link}}',
    createdDate: new Date(),
    voter0: true,
    voter1: false,
  };

  beforeEach(async () => {
    argumentServiceSpy.castVote.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [CastVoteComponent],
      providers: [{ provide: ArgumentService, useValue: argumentServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CastVoteComponent);
    component = fixture.componentInstance;
    component.argument = argument;
    component.argumentId = 'abc123';
    component.voterId = '1';
    component.canVote = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
