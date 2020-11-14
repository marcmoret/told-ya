import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArgumentComponent } from './argument/argument.component';
import { MainComponent } from './main/main.component';
import { VotingComponent } from './voting/voting.component';

const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'argument', component: ArgumentComponent },
  { path: 'argument/:id', component: VotingComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
