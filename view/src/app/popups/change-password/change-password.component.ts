import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  UserInfo;
  Form: FormGroup;
  PasswordMatch: Boolean = false;
  updateing: Boolean = false;


  constructor(
    private Service: SigninSignupServiceService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    this.Form = new FormGroup({
      UserId: new FormControl(this.UserInfo.data._id, Validators.required ),
      oldPassword: new FormControl('', Validators.required ),
      newPassword: new FormControl('', Validators.required)
    });
  }

  submit() {
    console.log(this.Form.value);
    if (this.Form.value.oldPassword !== '' && this.Form.value.newPassword !== '') {
      this.updateing = true;
      this.Service.ChangePassword(this.Form.value).subscribe( datas => { this.goto(datas); } );
    }
  }

  Changeing() {
    this.PasswordMatch = false;
  }
  goto(datas) {
    this.updateing = false;
    if (datas.status === 'True') {
        this.dialogRef.close('Success');
    }else if (datas.PassMatch === 'False') {
      this.PasswordMatch = true;
    }else {
      this.dialogRef.close('Error');
    }
  }



  close() {
    this.dialogRef.close('Close');
  }

}
