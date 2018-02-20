import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';

@Component({
  selector: 'app-profile-privacy',
  templateUrl: './profile-privacy.component.html',
  styleUrls: ['./profile-privacy.component.css']
})
export class ProfilePrivacyComponent implements OnInit {

  UserInfo;
  ShowEmail;
  ShowDOB;
  ShowLocation;

  updateing: Boolean = false;

  constructor( private Service: SigninSignupServiceService,
    private dialogRef: MatDialogRef<ProfilePrivacyComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
      this.Service.UserInfo(this.UserInfo.data._id).subscribe( datas => { this.setFormValues(datas); } );

     }

  setFormValues(datas) {
      this.ShowEmail = datas.data.ShowEmail;
      this.ShowDOB = datas.data.ShowDOB;
      this.ShowLocation = datas.data.ShowLocation;
  }

  ngOnInit() {
  }

  ShowEmailSelect(dd) {
    this.ShowEmail = dd;
  }
  ShowDOBSelect(dd) {
    this.ShowDOB = dd;
  }
  ShowLocationSelect(dd) {
    this.ShowLocation = dd;
  }

  submit() {
    const ReportPost = {'UserId': this.UserInfo.data._id,
                        'ShowEmail': this.ShowEmail,
                        'ShowDOB':  this.ShowDOB,
                        'ShowLocation':  this.ShowLocation
                      };
    this.updateing = true;
    this.Service.PrivacyUpdate(ReportPost).subscribe( datas => { this.goto(datas); } );
  }

  goto(datas) {
    this.updateing = false;
    if (datas.status === 'True') {
        this.dialogRef.close('Success');
    }else {
      this.dialogRef.close('Error');
    }
  }
  close() {
    this.dialogRef.close('Close');
  }
}
