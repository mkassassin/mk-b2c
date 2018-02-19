import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-profile-privacy',
  templateUrl: './profile-privacy.component.html',
  styleUrls: ['./profile-privacy.component.css']
})
export class ProfilePrivacyComponent implements OnInit {

  panelOpenState: Boolean = false;
  UserInfo;
  ShowEmail = 'EveryOne';
  ShowDOB = 'EveryOne';
  ShowLocation = 'EveryOne';



  constructor( private dialogRef: MatDialogRef<ProfilePrivacyComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
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
}
