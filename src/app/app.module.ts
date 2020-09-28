import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeadComponent } from './head/head.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { ArgumentComponent } from './argument/arguement.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyMaterialModule } from './MdModule.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    HeadComponent,
    FooterComponent,
    MainComponent,
    ArgumentComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MyMaterialModule,
    QuillModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
