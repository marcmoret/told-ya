import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Argument } from 'model/arguement.model';
import { ArgumentService } from 'src/api/argument.service';

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.sass'],
})
export class CastVoteComponent implements OnInit {
  @Input() argument: Argument;
  @Input() docId: string;
  @Input() voterId: string;
  loadingA = false;
  loadingB = false;

  constructor(
    private readonly argumentService: ArgumentService,
    private readonly snackService: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async castVote(person: string) {
    console.log(this.argument);

    this.argument[`votes${person}`]++;

    const voteTotal = this.argument[`votes${person}`];
    console.log(voteTotal);
    
    this.argumentService.castVote(this.voterId, voteTotal, this.docId, person);
  }
}
