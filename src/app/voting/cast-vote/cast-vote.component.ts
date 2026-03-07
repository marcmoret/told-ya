import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { ArgumentService } from '../../../api/argument.service';
import { Argument, VoteSide } from '../../shared/models/argument';

@Component({
  selector: 'app-cast-vote',
  standalone: true,
  templateUrl: './cast-vote.component.html',
  styleUrl: './cast-vote.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastVoteComponent {
  private readonly argumentService = inject(ArgumentService);

  @Input({ required: true }) argument!: Argument;
  @Input({ required: true }) argumentId!: string;
  @Input({ required: true }) voterId!: string;
  @Input() canVote = false;
  @Output() voted = new EventEmitter<void>();

  protected pendingSide: VoteSide | null = null;
  protected errorMessage = '';

  protected async castVote(side: VoteSide): Promise<void> {
    if (!this.canVote || this.pendingSide) {
      return;
    }

    this.errorMessage = '';
    this.pendingSide = side;

    try {
      await this.argumentService.castVote(this.argumentId, this.voterId, side);
      this.voted.emit();
    } catch {
      this.errorMessage = 'Could not record your vote. Refresh the page and try again.';
    } finally {
      this.pendingSide = null;
    }
  }
}
