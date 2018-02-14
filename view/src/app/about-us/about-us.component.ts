import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  ActivePage: String = '01';

  constructor(private router: Router,
    private ShareingService: DataSharedVarServiceService) { }

  gotoSignUp() {
    this.ShareingService.SetActiveSinInsignUpTab('SignUp');
      this.router.navigate(['SignInSignUp']);
  }

  gotoSignIn() {
    this.ShareingService.SetActiveSinInsignUpTab('SingIn');
      this.router.navigate(['SignInSignUp']);
  }

  ngOnInit() {
  }

  ActivePageChange(count: string) {
    this.ActivePage = count;
  }

}
