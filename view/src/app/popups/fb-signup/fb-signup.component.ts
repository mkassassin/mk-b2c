import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-fb-signup',
  templateUrl: './fb-signup.component.html',
  styleUrls: ['./fb-signup.component.css']
})
export class FbSignupComponent implements OnInit {

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

  RegisterForm: FormGroup;

  SocialData;

  constructor(private router: Router,
    private Service: SigninSignupServiceService,
    private dialogRef: MatDialogRef<FbSignupComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) {

     }

  ngOnInit() {
    this.RegisterForm = new FormGroup({
      UserName: new FormControl(this.data.Values.name, Validators.required ),
      UserEmail: new FormControl(this.data.Values.email, Validators.required),
      UserCategoryId: new FormControl('',  Validators.required),
      UserCategoryName: new FormControl('', Validators.required),
      ProviderType: new FormControl(this.data.Values.provider, Validators.required),
      ProviderId: new FormControl(this.data.Values.uid, Validators.required),
      UserImage: new FormControl(this.data.Values.image),
      UserCompany: new FormControl(''),
      UserProfession: new FormControl(''),
      UserDateOfBirth: new FormControl(''),
      UserGender: new FormControl(''),
      UserCountry: new FormControl(''),
      UserState: new FormControl(''),
      UserCity: new FormControl('')
    });
    this.ChekUserNameAvailabel();
    this.ChekUserEmailAvailabel();
  }


  ChekUserNameAvailabel() {
    if (this.RegisterForm.value.UserName !== '') {
      this.Service.NameValidate(this.RegisterForm.value.UserName).subscribe( datas => { this.gotoNameAnalyze(datas); } );
    }
  }

  ChekUserEmailAvailabel() {
    if (this.RegisterForm.value.UserEmail !== '') {
      this.Service.EmailValidate(this.RegisterForm.value.UserEmail).subscribe( datas => { this.gotoEmailAnalyze(datas); } );
    }
  }

  gotoNameAnalyze(datas: any) {
    if (datas.available === 'False') {
      this.UserNameNotAvailabel = true;
      this.UserNameAvailabel = false;
    }else {
      this.UserNameNotAvailabel = false;
      this.UserNameAvailabel = true;
      this.checkFormValidation();
    }
  }

  gotoEmailAnalyze(datas: any) {
    if (datas.available === 'False') {
      this.UserEmailNotAvailabel = true;
      this.UserEmailAvailabel = false;
    }else {
      this.UserEmailNotAvailabel = false;
      this.UserEmailAvailabel = true;
      this.checkFormValidation();
    }
  }


  CategorySelect(name: String, id: Number) {
    this.RegisterForm.controls['UserGender'].setValue('Male');
    if (this.SelectedCategory === name) {
      this.SelectedCategory = '';
      this.RegisterForm.controls['UserCategoryName'].setValue('');
      this.RegisterForm.controls['UserCategoryId'].setValue('');
      this.checkFormValidation();
    }else {
      this.SelectedCategory = name;
      this.RegisterForm.controls['UserCategoryName'].setValue(name);
      this.RegisterForm.controls['UserCategoryId'].setValue(id);
      this.checkFormValidation();
    }
  }

  genderSelect(Gender) {
    this.ActiveGender = Gender;
    this.RegisterForm.controls['UserGender'].setValue(Gender);
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
    if ( this.RegisterForm.value.UserName !== '' &&
        this.RegisterForm.value.UserEmail !== '' &&
        this.RegisterForm.value.UserCategoryId !== '' &&
        this.RegisterForm.value.UserCategoryName !== '' &&
        this.UserEmailAvailabel && this.UserNameAvailabel ) {
          this.formValid = true;
    }else {
      this.formValid = false;
    }
  }

  submit() {
    this.checkFormValidation();
    if (this.formValid) {
      this.formValid = true;
      this.Service.Register(this.RegisterForm.value).subscribe( datas => { this.FormSubmitStatus(datas); } );
    }
  }

  FormSubmitStatus(datas) {
    if (datas.status === 'True') {
      this.Service.FBUserValidate(datas.data.UserEmail, datas.data.ProviderId)
      .subscribe( newdatas => { this.goto(newdatas); } );
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
