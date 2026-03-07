import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Step {
  title: string;
  body: string;
}

interface Highlight {
  title: string;
  body: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  protected readonly steps: Step[] = [
    {
      title: 'Frame the debate',
      body: 'Write the topic once, capture both sides clearly, and keep the wording neutral.',
    },
    {
      title: 'Invite the voters',
      body: 'Add the people who should weigh in. Each person gets a unique text link.',
    },
    {
      title: 'Watch it settle',
      body: 'Votes land live, duplicate links are blocked, and the tally stays easy to read.',
    },
  ];

  protected readonly highlights: Highlight[] = [
    {
      title: 'No group-chat pile-on',
      body: 'Put the question in one place instead of letting the loudest person steer it.',
    },
    {
      title: 'One link per voter',
      body: 'Each invite is tied to a single vote, so the count is straightforward.',
    },
    {
      title: 'Fast enough to actually use',
      body: 'The app is built for low-stakes arguments that should not become a project.',
    },
  ];
}
