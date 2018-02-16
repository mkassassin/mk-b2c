import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';
import { SigninSignupServiceService } from './../service/signin-signup-service/signin-signup-service.service';

import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthService, SocialUser, FacebookLoginProvider } from 'angularx-social-login';

import { FbSignupComponent } from './../popups/fb-signup/fb-signup.component';

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.css']
})
export class SigninSignupComponent implements OnInit {

  colorTheme = 'theme-orange';

  ActiveTab: any;
  ActiveTabIndex: Number = 0 ;
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
  SignInForm: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(  public dialog: MatDialog,
                private authService: AuthService,
                private router: Router,
                private Service: SigninSignupServiceService,
                private ShareingService: DataSharedVarServiceService,
                private formBuilder: FormBuilder
              ) {
                this.ActiveTab = this.ShareingService.GetActiveSinInsignUpTab();
                this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD/MM/YYYY' });

                this.SignUpType = this.ShareingService.GetSingUpType();
               }

  user: SocialUser;



  ngOnInit() {
    this.RegisterForm = new FormGroup({
      UserName: new FormControl('', Validators.required),
      UserEmail: new FormControl('', Validators.required),
      UserPassword: new FormControl('',  Validators.required),
      UserCategoryId: new FormControl('',  Validators.required),
      UserCategoryName: new FormControl('', Validators.required),
      UserImage: new FormControl(''),
      UserCompany: new FormControl(''),
      UserProfession: new FormControl(''),
      UserDateOfBirth: new FormControl(''),
      UserGender: new FormControl(''),
      UserCountry: new FormControl(''),
      UserState: new FormControl(''),
      UserCity: new FormControl('')
    });

    this.SignInForm = new FormGroup({
      LoginUserEmail: new FormControl('', Validators.required),
      LoginUserPassword: new FormControl('',  Validators.required)
    });

    if (this.ActiveTab['ActiveTab'] === 'SingIn') {
      this.ActiveTabIndex = 1;
      if (this.ActiveTab['Email'] !== '') {
      this.SignInForm.controls['LoginUserEmail'].setValue(this.ActiveTab['Email']);
      }
    }else {
      this.ActiveTabIndex = 0;
      if (this.ActiveTab['Email'] !== '') {
        this.UserEmailAvailabel = false;
        this.RegisterForm.controls['UserEmail'].setValue(this.ActiveTab['Email']);
      }
    }

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

  onTabChange(event) {
  }

  CategorySelect(name: String, id: String) {
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
        this.RegisterForm.value.UserPassword !== '' &&
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

  FormSubmitStatus(data) {
    if (data.status === 'True') {
      this.ActiveTabIndex = 1;
      this.SignInForm.controls['UserEmail'].setValue(data.UserEmail);
    }
  }

  LoginFormsubmit() {
    this.Service.UserValidate(this.SignInForm.value.LoginUserEmail, this.SignInForm.value.LoginUserPassword)
    .subscribe( datas => { this.LoginFormSubmitStatus(datas); } );
  }

  LoginFormSubmitStatus(data) {
    if (data.status === 'True') {
      this.router.navigate(['Feeds']);
    }else {
      alert(data.message);
    }

  }


















  goto(datas) {
    if (datas.status === 'True') {
        this.router.navigate(['Feeds']);
    }else {
      this.Service.EmailValidate(this.user.email).subscribe( newdatas => { this.EmailAnalyze(newdatas); } );
    }
  }

  EmailAnalyze(newdatas: any) {
    if (newdatas.available === 'False') {
      alert('Your Facebook E-mail Already Registerd! please SignIn.');
      this.ActiveTabIndex = 1;
      this.SignInForm.controls['LoginUserEmail'].setValue(this.user.email);
      this.authService.signOut();
    }else {
      this.FbSignUp();
    }
  }

  FbSignUp() {
    const FbSignUpDialogRef = this.dialog.open( FbSignupComponent,
      { disableClose: true, minWidth: '40%', position: {top: '50px'},  data: { Type: 'Facebook', Values: this.user } });
      FbSignUpDialogRef.afterClosed().subscribe(result => this.FbSignUpComplete(result));
  }

  FbSignUpComplete(result) {
    if (result === 'Success') {
      this.router.navigate(['Feeds']);
    }else {
      this.authService.signOut();
    }
  }


  signInWithFB(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if ( this.user !== null ) {
        this.Service.FBUserValidate(this.user.email, this.user.id)
            .subscribe( datas => { this.goto(datas); } );
      }
    });
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }


}
