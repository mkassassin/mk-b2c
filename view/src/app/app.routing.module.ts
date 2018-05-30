import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './guard/auth.guard';
import { NotAuthGuard } from './guard/not-auth.guard';

import { AppComponent } from './app.component';
import { SigninSignupComponent } from './signin-signup/signin-signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { FeedsMainComponent } from './feeds-main/feeds-main.component';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { PageRoutingComponent } from './page-routing/page-routing/page-routing.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TermsComponent } from './terms/terms.component';
import { PolicyComponent } from './policy/policy.component';
import { SetNewpasswordComponent } from './page-routing/set-newpassword/set-newpassword.component';
import { TopicPageRoutingComponent } from './page-routing/topic-page-routing/topic-page-routing.component';
import { SharePostReturnPageComponent } from './share-post-return-page/share-post-return-page.component';

const appRoutes: Routes = [
    { path: '',
        component: WelcomeComponent,
        data: {
            animation: { value: 'welcome', }
        },
        canActivate: [NotAuthGuard]
    },
    { path: 'SignInSignUp',
        component: SigninSignupComponent,
        data: {
            animation: { value: 'SignInSignUp', }
        },
        canActivate: [NotAuthGuard]
    },
    { path: 'SetNewpassword/:UserId/:Token',
        component: SetNewpasswordComponent,
        data: {
            animation: { value: 'SetNewpassword', }
        },
        canActivate: [NotAuthGuard]
    },
    { path: 'About',
        component: AboutUsComponent,
        data: {
            animation: { value: 'About', }
        },
        canActivate: [NotAuthGuard]
    },
    { path: 'terms',
        component: TermsComponent,
        data: {
            animation: { value: 'terms', }
        },
        canActivate: [NotAuthGuard]
    },
    { path: 'privacy',
        component: PolicyComponent,
        data: {
            animation: { value: 'privacy', }
        }
    },
    { path: 'SharedPost/:PostId/:PostType',
        component: SharePostReturnPageComponent,
        data: {
            animation: { value: 'SharedPost', }
        }
    },
    { path: 'Feeds',
        component: FeedsMainComponent,
        data: {
            animation: { value: 'Feeds', }
        },
        canActivate: [AuthGuard]
    },
    { path: 'Profile',
        component: ProfileMainComponent,
        data: {
            animation: { value: 'Profile', }
        },
        canActivate: [AuthGuard]
    },
    { path: 'ViewProfile',
        component: PageRoutingComponent,
        data: {
            animation: { value: 'ViewProfile', }
        },
        canActivate: [AuthGuard]
    },
    { path: 'TopicPage',
        component: TopicPageRoutingComponent,
        data: {
            animation: { value: 'TopicPage', }
        },
        canActivate: [AuthGuard]
    }
  ];


@NgModule({
    declarations: [ ],
    imports: [ RouterModule.forRoot(appRoutes,
        { enableTracing: true }
      )],
    providers: [],
    bootstrap: []
  })
  export class AppRoutingModule { }
