import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SigninSignupComponent } from './signin-signup/signin-signup.component';
import { WelcomeComponent } from './welcome/welcome.component';

const appRoutes: Routes = [
    { path: '',  
        component: WelcomeComponent,  
        data: { 
            animation: { value: 'welcome', } 
        } 
    },
    { path: 'SignInSignUp',  
        component: SigninSignupComponent,  
        data: { 
            animation: { value: 'SignInSignUp', } 
        } 
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
