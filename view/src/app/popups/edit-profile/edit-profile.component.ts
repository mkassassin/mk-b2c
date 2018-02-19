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

  countries: any[]= [{'name': 'Country One', 'code': '01'},
                    {'name': 'Country Two', 'code': '02'}];
  filteredcountries: any[];
  countryCode: String;
  country: String;

  states: any[] = [{'name': 'State One', 'code': '01', 'newcode': '01'},
                  {'name': 'State Two', 'code': '01', 'newcode': '02'},
                  {'name': 'State One', 'code': '02', 'newcode': '03'},
                  {'name': 'State Two', 'code': '02', 'newcode': '04'} ];
  countryrRelatedStates: any[];
  filteredstates: any[];
  stateCode: String;
  state: String;

  cities: any[] = [{'name': 'City One', 'code': '01', 'newcode': '01'},
                  {'name': 'City Two', 'code': '01', 'newcode': '01'},
                  {'name': 'City One', 'code': '01', 'newcode': '02'},
                  {'name': 'City Two', 'code': '01', 'newcode': '02'},
                  {'name': 'City One', 'code': '02', 'newcode': '03'},
                  {'name': 'City Two', 'code': '02', 'newcode': '03'},
                  {'name': 'City One', 'code': '03', 'newcode': '04'},
                  {'name': 'City Two', 'code': '03', 'newcode': '04'} ];
  stateRelatedCities: any[];
  filteredcities: any[];
  city: String;

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
      UserEmail: new FormControl('', Validators.required),
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
    this.Form.controls['UserCountry'].setValue(datas.data.UserCountry);
    this.Form.controls['UserState'].setValue(datas.data.UserState);
    this.Form.controls['UserCity'].setValue(datas.data.UserCity);

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

  filterCountries(event) {
    this.filteredcountries = [];
    for (let i = 0; i < this.countries.length; i++) {
        const valueIndex = this.countries[i];
        const value = this.countries[i]['name'];
        if (value.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
            this.filteredcountries.push(valueIndex);
        }
    }
  }
  setCountry(event) {
    this.country = event.code;
    this.countryrRelatedStates = [];
      for (let i = 0; i < this.states.length; i++) {
        const valueIndex = this.states[i];
        const value = this.states[i]['code'];
        if (value.toLowerCase().indexOf(event.code.toLowerCase()) === 0) {
            this.countryrRelatedStates.push(valueIndex);
        }
      }
      this.checkFormValidation();
  }

  filterStates(event) {
    this.filteredstates = [];
    for (let i = 0; i < this.countryrRelatedStates.length; i++) {
      const valueIndex = this.countryrRelatedStates[i];
      const value = this.countryrRelatedStates[i]['name'];
        if (value.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
            this.filteredstates.push(valueIndex);
        }
    }
  }

  setState(event) {
    this.state = event;
    this.stateRelatedCities = [];
      for (let i = 0; i < this.cities.length; i++) {
        const valueIndex = this.cities[i];
        const value = this.cities[i]['newcode'];
        if (value.toLowerCase().indexOf(event.newcode.toLowerCase()) === 0) {
            this.stateRelatedCities.push(valueIndex);
        }
      }
      this.checkFormValidation();
  }

  filtercities(event) {
    this.filteredcities = [];
    for (let i = 0; i < this.stateRelatedCities.length; i++) {
      const valueIndex = this.stateRelatedCities[i];
      const value = this.stateRelatedCities[i]['name'];
        if (value.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
            this.filteredcities.push(valueIndex);
        }
    }
  }

  setCity(event) {
    this.city = event.name;
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
