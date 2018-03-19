import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Custome Module --------------------------------
import { AppRoutingModule } from './app.routing.module';

// Feture Module
import { FlexLayoutModule } from '@angular/flex-layout';
import { TabViewModule } from 'primeng/tabview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { GalleriaModule } from 'primeng/galleria';
import { BsDatepickerModule, TypeaheadModule, BsDropdownModule   } from 'ngx-bootstrap';
import { MatDialogModule, MatButtonModule, MatMenuModule,
  MatExpansionModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { NglModule } from 'ng-lightning/ng-lightning';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ChartsModule } from 'ng2-charts';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider
} from 'ng4-social-login';

const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('1094825930149-bl9tg0rsan3gjhffenkcmcs093bi572v.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('202967426952150')
  },
  {
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider('814ivvgus3ol7y')
  }
]);

export function provideConfig() {
  return CONFIG;
}

  // live
// const providers = {
//   'google': {
//         'clientId': '1094825930149-n7ec4je3dtpgrdm0msovsvt2kavfgbfv.apps.googleusercontent.com'
//       },
//       'linkedin': {
//         'clientId': '814ivvgus3ol7y'
//       },
//       'facebook': {
//         'clientId': '323054561538925',
//         'apiVersion': 'v2.11'
//       }
//   };

  // local
// const providers = {
//   'google': {
//         'clientId': '1094825930149-bl9tg0rsan3gjhffenkcmcs093bi572v.apps.googleusercontent.com'
//       },
//       'linkedin': {
//         'clientId': '814ivvgus3ol7y'
//       },
//       'facebook': {
//         'clientId': '202967426952150',
//         'apiVersion': 'v2.11'
//       }
//   };


import { FacebookModule } from 'ngx-facebook';

import { AuthGuard } from './guard/auth.guard';
import { NotAuthGuard } from './guard/not-auth.guard';

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
import { ProfileTimelineComponent } from './profile/profile-timeline/profile-timeline.component';
import { SigninSignupServiceService } from './service/signin-signup-service/signin-signup-service.service';
import { DataSharedVarServiceService } from './service/data-shared-var-service/data-shared-var-service.service';
import { PostThreeComponent } from './popups/post-three/post-three.component';
import { FollowServiceService } from './service/follow-service/follow-service.service';
import { PostServiceService } from './service/post-service/post-service.service';
import { ImagePreviewDirective } from './directives/image-preview.directive';
import { VideoPreviewDirective } from './directives/video-preview.directive';
import { LikeAndRatingServiceService } from './service/like-and-rating-service.service';
import { CommentAndAnswerService } from './service/comment-and-answer-service/comment-and-answer.service';
import { TrendsService } from './service/trends-service/trends.service';
import { ProfileSerivceService } from './service/profile-service/profile-serivce.service';
import { DiscoverComponent } from './popups/discover/discover.component';
import { HighlightsPostComponent } from './popups/posts/highlights-post/highlights-post.component';
import { QuestionsPostComponent } from './popups/posts/questions-post/questions-post.component';
import { SearchService } from './service/search-service/search.service';
import { ProfilePictureCropperComponent } from './popups/profile-picture-cropper/profile-picture-cropper.component';
import { DiscoverTopicsComponent } from './popups/discover-topics/discover-topics.component';
import { PageRoutingComponent } from './page-routing/page-routing/page-routing.component';
import { FbSignupComponent } from './popups/fb-signup/fb-signup.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CreatTopicComponent } from './popups/creat-topic/creat-topic.component';
import { ComponentConnectServiceService } from './service/component-connect-service.service';
import { TermsComponent } from './terms/terms.component';
import { PolicyComponent } from './policy/policy.component';
import { SelectMoreTopicsComponent } from './popups/select-more-topics/select-more-topics.component';
import { ReportUserComponent } from './popups/report-user/report-user.component';
import { ReportPostComponent } from './popups/report-post/report-post.component';
import { ReportAndDeleteService } from './service/report-and-delete-service/report-and-delete.service';
import { DeleteConfirmComponent } from './popups/delete-confirm/delete-confirm.component';
import { ForgotPasswordComponent } from './popups/forgot-password/forgot-password.component';
import { SetNewpasswordComponent } from './page-routing/set-newpassword/set-newpassword.component';
import { EditProfileComponent } from './popups/edit-profile/edit-profile.component';
import { ProfilePrivacyComponent } from './popups/profile-privacy/profile-privacy.component';
import { ChangePasswordComponent } from './popups/change-password/change-password.component';
import { EditPostOneComponent } from './popups/edit-post-one/edit-post-one.component';
import { EditPostTwoComponent } from './popups/edit-post-two/edit-post-two.component';
import { EditCommentComponent } from './popups/edit-comment/edit-comment.component';
import { EditAnswerComponent } from './popups/edit-answer/edit-answer.component';
import { FollowViewAllComponent } from './popups/follow-view-all/follow-view-all.component';
import { TopicPageRoutingComponent } from './page-routing/topic-page-routing/topic-page-routing.component';
import { TopicRoutingServiceService } from './service/topic-routing-service/topic-routing-service.service';
import { CoinFilterPipe } from './Pipes/Coin-filter-pipe';
import { SelectPeoplesComponent } from './popups/select-peoples/select-peoples.component';
import { SelectTopicsComponent } from './popups/select-topics/select-topics.component';
import { SharePostReturnPageComponent } from './share-post-return-page/share-post-return-page.component';
import { ShareReturnSinginSignupComponent } from './popups/share-return-singin-signup/share-return-singin-signup.component';


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
    ProfileTimelineComponent,
    PostThreeComponent,
    ImagePreviewDirective,
    VideoPreviewDirective,
    DiscoverComponent,
    TimeAgoPipe,
    HighlightsPostComponent,
    QuestionsPostComponent,
    ProfilePictureCropperComponent,
    DiscoverTopicsComponent,
    PageRoutingComponent,
    FbSignupComponent,
    AboutUsComponent,
    CreatTopicComponent,
    TermsComponent,
    PolicyComponent,
    SelectMoreTopicsComponent,
    ReportUserComponent,
    ReportPostComponent,
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    SetNewpasswordComponent,
    EditProfileComponent,
    ProfilePrivacyComponent,
    ChangePasswordComponent,
    EditPostOneComponent,
    EditPostTwoComponent,
    EditCommentComponent,
    EditAnswerComponent,
    FollowViewAllComponent,
    TopicPageRoutingComponent,
    CoinFilterPipe,
    SelectPeoplesComponent,
    SelectTopicsComponent,
    SharePostReturnPageComponent,
    ShareReturnSinginSignupComponent
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
    AutoCompleteModule,
    GalleriaModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSnackBarModule,
    FileUploadModule,
    NglModule.forRoot(),
    ChartsModule,
    SocialLoginModule,
    FacebookModule.forRoot()
  ],
  providers: [
                AuthGuard,
                NotAuthGuard,
                SigninSignupServiceService,
                DataSharedVarServiceService,
                FollowServiceService,
                PostServiceService,
                LikeAndRatingServiceService,
                CommentAndAnswerService,
                TrendsService,
                ProfileSerivceService,
                SearchService,
                ComponentConnectServiceService,
                ReportAndDeleteService,
                TopicRoutingServiceService,
                {
                  provide: AuthServiceConfig,
                  useFactory: provideConfig
                }
              ],
  bootstrap: [AppComponent],
  entryComponents: [ PostOneComponent,
                    PostTwoComponent,
                    PostThreeComponent,
                    DiscoverComponent,
                    HighlightsPostComponent,
                    QuestionsPostComponent,
                    ProfilePictureCropperComponent,
                    DiscoverTopicsComponent,
                    FbSignupComponent,
                    CreatTopicComponent,
                    SelectMoreTopicsComponent,
                    ReportUserComponent,
                    ReportPostComponent,
                    DeleteConfirmComponent,
                    ForgotPasswordComponent,
                    EditProfileComponent,
                    ProfilePrivacyComponent,
                    ChangePasswordComponent,
                    EditPostOneComponent,
                    EditPostTwoComponent,
                    EditCommentComponent,
                    EditAnswerComponent,
                    FollowViewAllComponent,
                    SelectPeoplesComponent,
                    SelectTopicsComponent,
                    ShareReturnSinginSignupComponent
                  ]
})
export class AppModule { }
