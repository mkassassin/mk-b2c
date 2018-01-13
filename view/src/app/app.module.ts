import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

//Custome Module --------------------------------
import { AppRoutingModule } from './app.routing.module';

//Feture Module
import { FlexLayoutModule } from "@angular/flex-layout";
import { TabViewModule } from 'primeng/primeng';
import { MatDialogModule, MatButtonModule } from '@angular/material';

import { AppComponent } from './app.component';
import { SigninSignupComponent } from './signin-signup/signin-signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { FeedsMainComponent } from './feeds-main/feeds-main.component';
import { FeedsLeftBarComponent } from './feeds-left-bar/feeds-left-bar.component';
import { FeedsRightBarComponent } from './feeds-right-bar/feeds-right-bar.component';
import { FeedsCenterComponent } from './feeds-center/feeds-center.component';
import { PostOneComponent } from './popups/post-one/post-one.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninSignupComponent,
    WelcomeComponent,
    FeedsMainComponent,
    FeedsLeftBarComponent,
    FeedsRightBarComponent,
    FeedsCenterComponent,
    PostOneComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    FlexLayoutModule,
    TabViewModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[PostOneComponent]
})
export class AppModule { }
