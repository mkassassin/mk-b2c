import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';
import { SigninSignupServiceService } from './../service/signin-signup-service/signin-signup-service.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FbSignupComponent } from './../popups/fb-signup/fb-signup.component';
import { SelectPeoplesComponent } from './../popups/select-peoples/select-peoples.component';
import { SelectTopicsComponent } from './../popups/select-topics/select-topics.component';

import { SocialUser, AuthService, FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider } from 'ng4-social-login';

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

  OpenCount;
  sub;

  ActiveSocialSignUp;

  private user: SocialUser;
  private loggedIn: boolean;

  constructor(  public dialog: MatDialog,
                private authService: AuthService,
                private router: Router,
                public snackBar: MatSnackBar,
                private Service: SigninSignupServiceService,
                private ShareingService: DataSharedVarServiceService
              ) {}

  ngOnInit() {
    this.ShareingService.SetActiveSinInsignUpTab('', '');
    this.screenHeight = window.innerHeight;
    this.scrollHeight = this.screenHeight + 'px';
    this.ActiveSocialSignUp = this.ShareingService.GetSocialLoginRouting();

    if (this.ActiveSocialSignUp['Provider'] === 'Google') {
      this.ShareingService.SetSocialLoginRouting('');
      this.signInWithGoogle();
    }else if (this.ActiveSocialSignUp['Provider'] === 'FaceBook') {
      this.ShareingService.SetSocialLoginRouting('');
      this.signInWithFB();
    }else if ( this.ActiveSocialSignUp['Provider'] === 'LinkedIn' ) {
      this.ShareingService.SetSocialLoginRouting('');
      this.signInWithLinkedIN();
    }else {
      this.SocialSignInSignUp();
    }

  }

  SocialSignInSignUp() {
    this.OpenCount = 0;
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if ( this.user !== null && this.OpenCount < 1 ) {
        if (this.user['email'] !== '' && this.user['email'] !== undefined && this.user['email'] !== null ) {
        this.Service.SocialUserValidate(this.user['email'], this.user['id'], this.user['provider'])
          .subscribe( datas => {
                if (datas['status'] === 'True') {
                    this.router.navigate(['Feeds']);
                }else {
                    this.Service.EmailValidate(this.user['email'])
                      .subscribe( newdatas => {
                            if (newdatas['available'] === 'False') {
                            this.snackBar.open('Your ' + this.user['provider'] + ' E-mail Already Registerd! please Singin', ' ', {
                                horizontalPosition: 'center',
                                duration: 3000,
                                verticalPosition: 'top',
                              });
                              this.authService.signOut();
                                this.ShareingService.SetActiveSinInsignUpTab('SingIn', this.user['email'] );
                                this.router.navigate(['SignInSignUp']);
                            }else {
                              this.OpenCount = this.OpenCount + 1;
                              if (this.OpenCount > 1) {
                              }else {
                                this.SocialSignUp(this.user);
                              }
                            }
                      });
                }
          });
        }
      }
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithLinkedIN(): void {
    this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  SocialSignUp(data) {
    this.dialog.closeAll();
    this.authService.signOut();
    const FbSignUpDialogRef = this.dialog.open( FbSignupComponent,
      { disableClose: true, minWidth: '600px', position: {top: '50px'},  data: { Type: data['provider'], Values: data } });
      FbSignUpDialogRef.afterClosed().subscribe(result => this.SocialSignUpComplete(result));
  }

  SocialSignUpComplete(result) {
    if (result.status === 'Success') {
      this.dialog.closeAll();
      this.snackBar.open('Your Account Successfully Created. ', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });

      const SelectPeopleDialogRef = this.dialog.open( SelectPeoplesComponent,
        { disableClose: true, maxWidth: '99%', position: {top: '50px'},
          data: { Header: 'Select Peoples', ActiveCategory: result.data.UserCategoryId  } });
      SelectPeopleDialogRef.afterClosed().subscribe(next => {

          const SelectTopicDialogRef = this.dialog.open( SelectTopicsComponent,
            { disableClose: true, maxWidth: '99%', position: {top: '50px'},
              data: { Header: 'Select Topics'  } });
              SelectTopicDialogRef.afterClosed().subscribe(final => {

              this.router.navigate(['Feeds']);
            });

        });

    }else if (result.status === 'Error') {
      this.dialog.closeAll();
      this.snackBar.open('Some Error Occurred Will Create The Account ', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }else {
      this.SocialSignInSignUp();
      this.dialog.closeAll();
      this.ShareingService.SetActiveSinInsignUpTab('SingUp', '' );
      this.router.navigate(['SignInSignUp']);
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
