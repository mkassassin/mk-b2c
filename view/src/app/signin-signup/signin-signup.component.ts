import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DataSharedVarServiceService } from "./../service/data-shared-var-service/data-shared-var-service.service";
import { SigninSignupServiceService } from "./../service/signin-signup-service/signin-signup-service.service";

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.css']
})
export class SigninSignupComponent implements OnInit {

  ActiveTab: any;
  ActiveTabIndex:number = 0 ;
  MaleActive:boolean = true;
  FemaleActive:boolean = false;
  SelectedCategory:string = '';

  constructor(  private router: Router, 
                private Service: SigninSignupServiceService, 
                private ShareingService: DataSharedVarServiceService
              ) {
                this.ActiveTab = this.ShareingService.GetActiveSinInsignUpTab();
               }

  ngOnInit() {
    console.log(this.ActiveTab);
    if(this.ActiveTab['ActiveTab'] === "SingIn"){ this.ActiveTabIndex = 1; }else{ this.ActiveTabIndex = 0;}
  }

  onTabChange(event){
  }

  CategorySelect(name:string, id:number){
    if(this.SelectedCategory == name){
      this.SelectedCategory = '';
    }else{ 
      this.SelectedCategory = name; 
    }
    
    
  }

  genderSelect(){
    this.MaleActive = !this.MaleActive;
    this.FemaleActive = !this.FemaleActive;
  }

}
