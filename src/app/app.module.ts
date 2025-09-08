
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeadComponent } from './head/head.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { ArgumentComponent } from './argument/argument.component';
import { QuillModule } from 'ngx-quill';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { CastVoteComponent } from './voting/cast-vote/cast-vote.component';
import { VotingComponent } from './voting/voting.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent,],
  exports: []
})
export class AppModule {}
