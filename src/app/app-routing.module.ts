import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArgumentComponent } from './argument/arguement.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'argument', component: ArgumentComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
