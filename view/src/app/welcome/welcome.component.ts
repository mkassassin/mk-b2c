import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';
import { SigninSignupServiceService } from './../service/signin-signup-service/signin-signup-service.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
// import { AuthService, SocialUser, FacebookLoginProvider } from 'angularx-social-login';

// import { AuthService } from 'angular2-social-login';
import { FbSignupComponent } from './../popups/fb-signup/fb-signup.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  scrollHeight;
  screenHeight: number;

  email: String = '';
  ShowEmailAlert: Boolean = false;

  sub;
  // user: SocialUser;

  constructor(  public dialog: MatDialog,
                // private _auth: AuthService,
                private router: Router,
                public snackBar: MatSnackBar,
                private Service: SigninSignupServiceService,
                private ShareingService: DataSharedVarServiceService
              ) {}

  ngOnInit() {
    this.ShareingService.SetActiveSinInsignUpTab('', '');
    this.screenHeight = window.innerHeight;
    this.scrollHeight = this.screenHeight + 'px';
  }















  // signIn(provider) {
  //   this.sub = this._auth.login(provider)
  //     .subscribe((data) => {
  //           if ( data !== null ) {
  //               if (data['email'] !== '' && data['email'] !== undefined && data['email'] !== null ) {
  //               this.Service.SocialUserValidate(data['email'], data['uid'], data['provider'])
  //                 .subscribe( datas => {
  //                       if (datas['status'] === 'True') {
  //                           this.router.navigate(['Feeds']);
  //                       }else {
  //                           this.Service.EmailValidate(data['email'])
  //                             .subscribe( newdatas => {
  //                                   if (newdatas['available'] === 'False') {
  //                                   this.snackBar.open('Your ' + data['provider'] + ' E-mail Already Registerd! please Singin', ' ', {
  //                                       horizontalPosition: 'center',
  //                                       duration: 3000,
  //                                       verticalPosition: 'top',
  //                                     });
  //                                       this.ShareingService.SetActiveSinInsignUpTab('SingIn', data['email'] );
  //                                       this.router.navigate(['SignInSignUp']);
  //                                   }else {
  //                                     localStorage.setItem('SocialLoginData', JSON.stringify(data));
  //                                     this.SocialSignUp(data);
  //                                   }
  //                             });
  //                       }
  //                 });
  //               }
  //           }
  //     });

  // }



  SocialSignUp(data) {
    const FbSignUpDialogRef = this.dialog.open( FbSignupComponent,
      { disableClose: true, minWidth: '40%', position: {top: '50px'},  data: { Type: data['provider'], Values: data } });
      FbSignUpDialogRef.afterClosed().subscribe(result => this.SocialSignUpComplete(result));
  }

  SocialSignUpComplete(result) {
    if (result === 'Success') {
      this.router.navigate(['Feeds']);
    }else {
      console.log(result);
    }
  }



















  gotoNext(email: string) {
    if (email.length >= 6 ) {
      this.Service.EmailValidate(email).subscribe( datas => { this.gotoAnalyze(datas); } );
    }else {
      this.ShowEmailAlert = true;
      setTimeout(() => { this.ShowEmailAlert = false; }, 5000);
    }
  }

  gotoAnalyze(datas: any) {
    if (datas.status === 'True') {
      if (datas.available === 'False') {
        this.ShareingService.SetActiveSinInsignUpTab('SingIn', this.email);
        this.router.navigate(['SignInSignUp']);
      }else {
        this.ShareingService.SetActiveSinInsignUpTab('SignUp', this.email);
        this.router.navigate(['SignInSignUp']);
      }
    }else {
      this.ShareingService.SetActiveSinInsignUpTab('SignUp');
      this.router.navigate(['SignInSignUp']);
    }
  }
  gotoSignUp(email: string) {
    this.ShareingService.SetActiveSinInsignUpTab('SignUp');
    this.router.navigate(['SignInSignUp']);
  }
  gotoSignIn(email: string) {
    this.ShareingService.SetActiveSinInsignUpTab('SingIn');
    this.router.navigate(['SignInSignUp']);
  }


}
