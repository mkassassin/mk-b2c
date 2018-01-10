import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.css']
})
export class SigninSignupComponent implements OnInit {

  SingUpActive:boolean = true;
  SingInActive:boolean = false;
  MaleActive:boolean = true;
  FemaleActive:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onclick(){
    this.SingUpActive = !this.SingUpActive;
    this.SingInActive = !this.SingInActive;
  }

  genderSelect(){
    this.MaleActive = !this.MaleActive;
    this.FemaleActive = !this.FemaleActive;
  }

}
