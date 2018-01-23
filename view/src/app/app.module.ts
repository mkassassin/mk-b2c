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
import { TabViewModule } from "primeng/tabview";
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatDialogModule, MatButtonModule, MatMenuModule } from '@angular/material';

import { AppComponent } from './app.component';
import { SigninSignupComponent } from './signin-signup/signin-signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { FeedsMainComponent } from './feeds-main/feeds-main.component';
import { FeedsLeftBarComponent } from './feeds/feeds-left-bar/feeds-left-bar.component';
import { FeedsRightBarComponent } from './feeds/feeds-right-bar/feeds-right-bar.component';
import { FeedsCenterComponent } from './feeds/feeds-center/feeds-center.component';
import { PostOneComponent } from './popups/post-one/post-one.component';
import { PostTwoComponent } from './popups/post-two/post-two.component';
import { FeedsHighlightsComponent } from './feeds/feeds-highlights/feeds-highlights.component';
import { FeedsQuestionsComponent } from './feeds/feeds-questions/feeds-questions.component';
import { FeedsTrendsComponent } from './feeds/feeds-trends/feeds-trends.component';
import { FeedsHeaderComponent } from './feeds/feeds-header/feeds-header.component';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { ProfileLeftBarComponent } from './profile/profile-left-bar/profile-left-bar.component';
import { ProfileRightBarComponent } from './profile/profile-right-bar/profile-right-bar.component';
import { ProfileTimelineComponent } from './profile/profile-timeline/profile-timeline.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninSignupComponent,
    WelcomeComponent,
    FeedsMainComponent,
    FeedsLeftBarComponent,
    FeedsRightBarComponent,
    FeedsCenterComponent,
    PostOneComponent,
    PostTwoComponent,
    FeedsHighlightsComponent,
    FeedsQuestionsComponent,
    FeedsTrendsComponent,
    FeedsHeaderComponent,
    ProfileMainComponent,
    ProfileLeftBarComponent,
    ProfileRightBarComponent,
    ProfileTimelineComponent
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
    ScrollPanelModule,
    OverlayPanelModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[PostOneComponent, PostTwoComponent]
})
export class AppModule { }
