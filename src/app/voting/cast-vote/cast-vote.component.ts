import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Argument } from '../../models/argument.model';
import { ArgumentService } from '../../../api/argument.service';

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrl: './cast-vote.component.scss',
})
export class CastVoteComponent {
  @Input() argument: Argument;
  @Input() docId: string;
  @Input() voterId: string;
  @Output() castVoted = new EventEmitter<boolean>();

  loadingA = false;
  loadingB = false;

  constructor(
    private readonly argumentService: ArgumentService,
    private readonly snackService: MatSnackBar
  ) {}

  async castVote(person: string) {
    if (person === 'A') {
      this.loadingA = true;
    } else {
      this.loadingB = true;
    }

    const votesKey = `votes${person}` as 'votesA' | 'votesB';
    this.argument[votesKey]++;
    const voteTotal = this.argument[votesKey];

    this.argumentService
      .castVote(this.voterId, voteTotal, this.docId, person)
      .then(() => {
        this.snackService.open('Successfully casted vote!', '', {
          duration: 3000,
        });
        this.castVoted.emit(false);
      })
      .catch(() => {
        if (person === 'A') {
          this.loadingA = false;
        } else {
          this.loadingB = false;
        }
      });
  }
}
