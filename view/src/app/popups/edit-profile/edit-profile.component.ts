import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  colorTheme = 'theme-orange';

  ActiveGender: String = 'Male';
  SelectedCategory: String = '';
  UserNameAvailabel: Boolean = false;
  UserNameNotAvailabel: Boolean = false;
  UserEmailAvailabel: Boolean = false;
  UserEmailNotAvailabel: Boolean = false;
  formValid: Boolean = false;
  LoginformValid: Boolean = false;
  SignUpType: any;


  Form: FormGroup;
  UserInfo;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private Service: SigninSignupServiceService,
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD/MM/YYYY' });
      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    this.Form = new FormGroup({
      UserId: new FormControl(this.UserInfo.data._id, Validators.required ),
      UserName: new FormControl('', Validators.required ),
      UserEmail: new FormControl({value: '', disabled: true}, Validators.required),
      UserCompany: new FormControl(''),
      UserProfession: new FormControl(''),
      UserDateOfBirth: new FormControl(''),
      UserGender: new FormControl(''),
      UserCountry: new FormControl(''),
      UserState: new FormControl(''),
      UserCity: new FormControl('')
    });
    this.Service.UserInfo(this.UserInfo.data._id).subscribe( datas => { this.setFormValues(datas); } );
  }


  setFormValues(datas) {
    this.Form.controls['UserName'].setValue(datas.data.UserName);
    this.Form.controls['UserEmail'].setValue(datas.data.UserEmail);
    this.Form.controls['UserCompany'].setValue(datas.data.UserCompany);
    this.Form.controls['UserProfession'].setValue(datas.data.UserProfession);
    this.Form.controls['UserDateOfBirth'].setValue(datas.data.UserDateOfBirth);
    this.Form.controls['UserGender'].setValue(datas.data.UserGender);
    this.Form.controls['UserCountry'].setValue(datas.data.UserCountry[0]);
    this.Form.controls['UserState'].setValue(datas.data.UserState[0]);
    this.Form.controls['UserCity'].setValue(datas.data.UserCity[0]);

    this.CategorySelect(datas.data.UserCategoryName, datas.data.UserCategoryId);
    this.genderSelect(datas.data.UserGender);
  }






  CategorySelect(name: String, id: Number) {
      this.SelectedCategory = name;
  }

  genderSelect(Gender) {
    this.ActiveGender = Gender;
    this.Form.controls['UserGender'].setValue(Gender);
    this.checkFormValidation();
  }


  checkFormValidation() {
    if ( this.Form.value.UserName !== '' &&
        this.Form.value.UserEmail !== '') {
        this.formValid = true;
    }else {
        this.formValid = false;
    }
  }

  submit() {
    this.checkFormValidation();
    if (this.formValid) {
      this.formValid = true;
      this.Service.ProfileUpdate(this.Form.value).subscribe( datas => { this.goto(datas); } );
    }
  }


  goto(datas) {
    if (datas.status === 'True') {
        this.dialogRef.close('Success');
    }else {
      alert('error');
    }
  }



  close() {
    this.dialogRef.close('Close');
  }
}
