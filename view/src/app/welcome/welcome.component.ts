import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DataSharedVarServiceService } from "./../service/data-shared-var-service/data-shared-var-service.service";
import { SigninSignupServiceService } from "./../service/signin-signup-service/signin-signup-service.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  scrollHeight;
  screenHeight:number;

  email:string = "";
  ShowEmailAlert:boolean = false;

  constructor(  private router: Router, 
                private Service: SigninSignupServiceService, 
                private ShareingService: DataSharedVarServiceService
              ) {}

  ngOnInit() {
    this.ShareingService.SetActiveSinInsignUpTab('','');
    this.screenHeight = window.innerHeight;
    this.scrollHeight = this.screenHeight + "px";
  }

  gotoNext(email:string){
    if(email.length >= 6 ){
      this.Service.EmailValidate(email).subscribe( datas => { this.gotoAnalyze(datas); } );
    }else{
      this.ShowEmailAlert = true;
      setTimeout(()=>{ this.ShowEmailAlert = false; },5000);
    }
  }

  gotoAnalyze(datas:any){
    if(datas.status === "True"){
      if(datas.available === "False"){
        this.ShareingService.SetActiveSinInsignUpTab('SingIn',this.email);
        this.router.navigate(['SignInSignUp']);
      }else{
        this.ShareingService.SetActiveSinInsignUpTab('SignUp',this.email);
        this.router.navigate(['SignInSignUp']);
      }
    }else{
      this.ShareingService.SetActiveSinInsignUpTab('SignUp');
      this.router.navigate(['SignInSignUp']);
    }
  }
  gotoSignUp(email:string){
    this.ShareingService.SetActiveSinInsignUpTab('SignUp');
    this.router.navigate(['SignInSignUp']);
  }
  gotoSignIn(email:string){
    this.ShareingService.SetActiveSinInsignUpTab('SingIn');
    this.router.navigate(['SignInSignUp']);
  }


}
