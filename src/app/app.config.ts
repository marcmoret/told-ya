import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { MainComponent } from './main/main.component';
import { ArgumentComponent } from './argument/argument.component';
import { VotingComponent } from './voting/voting.component';

const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'argument', component: ArgumentComponent },
  { path: 'argument/:id', component: VotingComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),
  ],
};
