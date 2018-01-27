import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { DataSharedVarServiceService } from "./../service/data-shared-var-service/data-shared-var-service.service";
import { SigninSignupServiceService } from "./../service/signin-signup-service/signin-signup-service.service";

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.css']
})
export class SigninSignupComponent implements OnInit {

  colorTheme = 'theme-orange';

  ActiveTab: any;
  ActiveTabIndex:number = 0 ;
  ActiveGender:String = 'Male';
  SelectedCategory:string = '';
  UserNameAvailabel:boolean = false;
  UserNameNotAvailabel:boolean = false;
  UserEmailAvailabel:boolean = false;
  UserEmailNotAvailabel:boolean = false;
  formValid:boolean = false;
  LoginformValid:boolean = false;

  countries:any[]= [{"name":"Country One", "code":"01"},
                    {"name":"Country Two", "code":"02"}];
  filteredcountries: any[];
  countryCode:string;
  country:string;

  states:any[] = [{"name":"State One", "code":"01", "newcode":"01"},
                  {"name":"State Two", "code":"01", "newcode":"02"},
                  {"name":"State One", "code":"02", "newcode":"03"},
                  {"name":"State Two", "code":"02", "newcode":"04"} ];
  countryrRelatedStates: any[];
  filteredstates: any[];
  stateCode:string;
  state:string;

  cities:any[] = [{"name":"City One", "code":"01", "newcode":"01"},
                  {"name":"City Two", "code":"01", "newcode":"01"},
                  {"name":"City One", "code":"01", "newcode":"02"},
                  {"name":"City Two", "code":"01", "newcode":"02"},
                  {"name":"City One", "code":"02", "newcode":"03"},
                  {"name":"City Two", "code":"02", "newcode":"03"},
                  {"name":"City One", "code":"03", "newcode":"04"}, 
                  {"name":"City Two", "code":"03", "newcode":"04"} ];
  stateRelatedCities: any[];
  filteredcities: any[];
  city:string;

  RegisterForm: FormGroup;
  SignInForm: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(  private router: Router, 
                private Service: SigninSignupServiceService, 
                private ShareingService: DataSharedVarServiceService,
                private formBuilder: FormBuilder,
              ) {
                this.ActiveTab = this.ShareingService.GetActiveSinInsignUpTab();
                this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD/MM/YYYY' });
               }

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

    if(this.ActiveTab['ActiveTab'] === "SingIn"){
      this.ActiveTabIndex = 1; 
      if(this.ActiveTab['Email'] !== ""){ 
      this.SignInForm.controls['LoginUserEmail'].setValue(this.ActiveTab['Email']);  
      }
    }else{ 
      this.ActiveTabIndex = 0;
      if(this.ActiveTab['Email'] !== ""){
        this.UserEmailAvailabel = true;
        this.RegisterForm.controls['UserEmail'].setValue(this.ActiveTab['Email']);
      }
    }   

  }

  ChekUserNameAvailabel(){
    if(this.RegisterForm.value.UserName != ''){
      this.Service.NameValidate(this.RegisterForm.value.UserName).subscribe( datas => { this.gotoNameAnalyze(datas); } );
    }
  }

  ChekUserEmailAvailabel(){
    if(this.RegisterForm.value.UserEmail != ''){
      this.Service.EmailValidate(this.RegisterForm.value.UserEmail).subscribe( datas => { this.gotoEmailAnalyze(datas); } );
    }
  }

  gotoNameAnalyze(datas:any){
    if(datas.available === "False"){
      this.UserNameNotAvailabel = true;
      this.UserNameAvailabel = false;
    }else{
      this.UserNameNotAvailabel = false;
      this.UserNameAvailabel = true;
      this.checkFormValidation();
    }
  }

  gotoEmailAnalyze(datas:any){
    if(datas.available === "False"){
      this.UserEmailNotAvailabel = true;
      this.UserEmailAvailabel = false;
    }else{
      this.UserEmailNotAvailabel = false;
      this.UserEmailAvailabel = true;
      this.checkFormValidation();
    }
  }

  onTabChange(event){
  }

  CategorySelect(name:string, id:number){
    this.RegisterForm.controls['UserGender'].setValue('Male');
    if(this.SelectedCategory == name){
      this.SelectedCategory = '';
      this.RegisterForm.controls['UserCategoryName'].setValue('');
      this.RegisterForm.controls['UserCategoryId'].setValue('');
      this.checkFormValidation();
    }else{ 
      this.SelectedCategory = name;
      this.RegisterForm.controls['UserCategoryName'].setValue(name);
      this.RegisterForm.controls['UserCategoryId'].setValue(id);
      this.checkFormValidation();
    }
    
  }

  genderSelect(Gender){
    this.ActiveGender = Gender;
    this.RegisterForm.controls['UserGender'].setValue(Gender);
    this.checkFormValidation();
  }

  filterCountries(event) {
    this.filteredcountries = [];
    for(let i = 0; i < this.countries.length; i++) {
        let valueIndex = this.countries[i];
        let value = this.countries[i]['name'];
        if(value.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.filteredcountries.push(valueIndex);
        }
    }
  }
  setCountry(event){
    this.country = event.code;
    this.countryrRelatedStates = [];
      for(let i = 0; i < this.states.length; i++) {
        let valueIndex = this.states[i];
        let value = this.states[i]['code'];
        if(value.toLowerCase().indexOf(event.code.toLowerCase()) == 0) {
            this.countryrRelatedStates.push(valueIndex);
        }
      }
      this.checkFormValidation();
  }

  filterStates(event) {
    this.filteredstates = [];
    for(let i = 0; i < this.countryrRelatedStates.length; i++) {
        let valueIndex = this.countryrRelatedStates[i];
        let value = this.countryrRelatedStates[i]['name'];
        if(value.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.filteredstates.push(valueIndex);
        }
    }
  }

  setState(event){
    this.state = event;
    this.stateRelatedCities = [];
      for(let i = 0; i < this.cities.length; i++) {
        let valueIndex = this.cities[i];
        let value = this.cities[i]['newcode'];
        if(value.toLowerCase().indexOf(event.newcode.toLowerCase()) == 0) {
            this.stateRelatedCities.push(valueIndex);
        }
      }
      this.checkFormValidation();
  }

  filtercities(event) {
    this.filteredcities = [];
    for(let i = 0; i < this.stateRelatedCities.length; i++) {
        let valueIndex = this.stateRelatedCities[i];
        let value = this.stateRelatedCities[i]['name'];
        if(value.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.filteredcities.push(valueIndex);
        }
    }
  }

  setCity(event){
    this.city = event.name;
    this.checkFormValidation();
  }

  checkFormValidation(){
    if( this.RegisterForm.value.UserName !== '' &&
        this.RegisterForm.value.UserEmail !== '' && 
        this.RegisterForm.value.UserPassword !== '' && 
        this.RegisterForm.value.UserCategoryId !== '' && 
        this.RegisterForm.value.UserCategoryName !== '' && 
        this.UserEmailAvailabel && this.UserNameAvailabel ){
          this.formValid = true;
    }else{
      this.formValid = false;
    }
  }

  submit(){
    this.checkFormValidation();
    if(this.formValid){
      this.formValid = true;
      this.Service.Register(this.RegisterForm.value).subscribe( datas => { this.FormSubmitStatus(datas); } );
    }
  }

  FormSubmitStatus(data){
    if(data.status == 'True'){
      this.ActiveTabIndex = 1
      this.SignInForm.controls['UserEmail'].setValue(data.UserEmail);
    }
  }

  LoginFormsubmit(){
    this.Service.UserValidate(this.SignInForm.value.LoginUserEmail, this.SignInForm.value.LoginUserPassword).subscribe( datas => { this.LoginFormSubmitStatus(datas); } );
  }

  LoginFormSubmitStatus(data){
    console.log(data);
    if(data.status == 'True'){
      this.router.navigate(['Feeds']);
    }

  }


}
