import { Routes } from '@angular/router';

import { ArgumentComponent } from './argument/argument.component';
import { MainComponent } from './main/main.component';
import { VotingComponent } from './voting/voting.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    title: 'Told Ya',
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'argument',
    component: ArgumentComponent,
    title: 'Create a Vote',
  },
  {
    path: 'argument/:argumentId/:voterId',
    component: VotingComponent,
    title: 'Vote',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
