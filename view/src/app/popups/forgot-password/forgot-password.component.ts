import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  UserEmailNotAvailable: Boolean = false;
  formValid: Boolean = false;
  SuccessSend: Boolean = false;
  SendError: Boolean = false;
  SomeError: Boolean = false;
  PageLoaded: Boolean = false;

  FormOne: FormGroup;
  FormTwo: FormGroup;
  SubmitLoading: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private Service: SigninSignupServiceService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent >,
    @Inject(MAT_DIALOG_DATA) private data: any) {

     }

     ngOnInit() {
      this.FormOne = new FormGroup({
        UserEmail: new FormControl('', Validators.required)
      });
      this.FormTwo = new FormGroup({
        UserEmail: new FormControl('', Validators.required),
        NewPassword: new FormControl('', Validators.required)
      });

      if (this.data.Type === 'ForgotPassword') {
        this.FormOneGroup();
      }
      if ( this.data.Type === 'SetNewPassword') {
        this.FormTwoGroup();
      }
    }



    FormOneGroup() {
      if (this.data.Email !== '' && this.data.Email !== null) {
        this.FormOne.controls['UserEmail'].setValue(this.data.Email);
        this.ChekUserEmailAvailabel();
      }
    }
    ChekUserEmailAvailabel() {
      if (this.FormOne.value.UserEmail !== '') {
        this.Service.EmailValidate(this.FormOne.value.UserEmail).subscribe( datas => { this.gotoEmailAnalyze(datas); } );
      }
    }
    gotoEmailAnalyze(datas: any) {
      if (datas['available'] === 'True') {
        this.UserEmailNotAvailable = true;
      }else {
        this.UserEmailNotAvailable = false;
      }
    }
    submitEmail () {
      if (this.FormOne.value.UserEmail !== '') {
        this.SubmitLoading = true;
          this.Service.EmailValidate(this.FormOne.value.UserEmail)
          .subscribe( datas => {
            const data: any = datas;
            if (data['available'] === 'True') {
              this.UserEmailNotAvailable = true;
              this.SubmitLoading = false;
            }else {
              this.Service.SendFPVerifyEmail(this.FormOne.value.UserEmail).subscribe( result => {
                if (result.status === 'True' ) {
                  this.SubmitLoading = false;
                  this.SuccessSend = true;
                  this.SendError = false;
                }else {
                  this.SuccessSend = false;
                  this.SendError = true;
                }
              });
            }
          });
      }
    }



    close() {
      this.dialogRef.close('Close');
    }



    FormTwoGroup() {
      if (this.data.UserId !== '' && this.data.Token !== '' ) {
        this.Service.NewPasswordEmailValidate(this.data.UserId, this.data.Token).subscribe( result => {
          this.PageLoaded = true;
          if (result.status === 'True' ) {
            this.FormTwo.controls['UserEmail'].setValue(result.data.UserEmail);
            console.log(this.FormTwo.value);
          }else {
            alert(result.message);
            this.dialogRef.close('Close');
          }
        });
      }
    }

    submitPassword() {
      const senddata = {'UserId': this.data.UserId,
                    'token': this.data.Token,
                    'NewPassword':  this.FormTwo.value.NewPassword
                  };
      this.Service.UpdatePassword(senddata).subscribe( result => {
        if (result.status === 'True' ) {
          this.Service.UserValidate(this.FormTwo.value.UserEmail, this.FormTwo.value.NewPassword)
              .subscribe( datas => {
                const getLoginData: any = datas;
                if (getLoginData.status === 'True') {
                    this.dialogRef.close('SinginSuccess');
                }else {
                  this.dialogRef.close('PleaseSignIn');
                }
               });
        }else {
          alert('Password Update Failed! Please Contact Our Team.');
          this.dialogRef.close('Close');
        }
      });
    }

}
