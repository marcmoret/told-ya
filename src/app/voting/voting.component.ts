import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ArgumentService } from '../../api/argument.service';
import {
  Argument,
  VoteSide,
  getTotalVotes,
  getVoteCountKey,
  getVoterKey,
  isValidVoterId,
} from '../shared/models/argument';
import { CastVoteComponent } from './cast-vote/cast-vote.component';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [RouterLink, CastVoteComponent],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly argumentService = inject(ArgumentService);
  private readonly destroyRef = inject(DestroyRef);

  protected argument: Argument | null = null;
  protected argumentId = '';
  protected voterId = '';
  protected loading = true;
  protected linkInvalid = false;
  protected isEligible = false;
  protected flashMessage = '';

  ngOnInit(): void {
    this.argumentId = this.route.snapshot.paramMap.get('argumentId') ?? '';
    this.voterId = this.route.snapshot.paramMap.get('voterId') ?? '';

    if (!this.argumentId || !this.voterId) {
      this.loading = false;
      this.linkInvalid = true;
      return;
    }

    this.argumentService
      .watchArgument(this.argumentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((argument) => {
        this.loading = false;

        if (!argument) {
          this.argument = null;
          this.linkInvalid = true;
          this.isEligible = false;
          return;
        }

        this.argument = argument;
        this.linkInvalid = !isValidVoterId(argument, this.voterId);
        this.isEligible = !this.linkInvalid && !argument[getVoterKey(this.voterId)];
      });
  }

  protected handleVoteRecorded(): void {
    this.flashMessage = 'Vote recorded. Results are live now.';
  }

  protected get totalVotes(): number {
    return this.argument ? getTotalVotes(this.argument) : 0;
  }

  protected votesFor(side: VoteSide): number {
    return this.argument ? this.argument[getVoteCountKey(side)] : 0;
  }

  protected percentageFor(side: VoteSide): number {
    if (!this.argument) {
      return 0;
    }

    const totalVotes = getTotalVotes(this.argument);

    if (totalVotes === 0) {
      return 0;
    }

    return Math.round((this.argument[getVoteCountKey(side)] / totalVotes) * 100);
  }

  protected get leadingLabel(): string {
    if (!this.argument || this.argument.votesA === this.argument.votesB) {
      return 'Tied';
    }

    return this.argument.votesA > this.argument.votesB
      ? this.argument.personA
      : this.argument.personB;
  }
}
