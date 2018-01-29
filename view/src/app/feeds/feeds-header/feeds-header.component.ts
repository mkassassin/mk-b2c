import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DataSharedVarServiceService } from "./../../service/data-shared-var-service/data-shared-var-service.service";

@Component({
  selector: 'app-feeds-header',
  templateUrl: './feeds-header.component.html',
  styleUrls: ['./feeds-header.component.css']
})
export class FeedsHeaderComponent implements OnInit {

  constructor(private router: Router, private ShareingService: DataSharedVarServiceService,) { }

  ngOnInit() {
  }

  LogOut(){
    let localDataString = localStorage.getItem('currentUser');
    let localData = JSON.parse(localDataString);
    this.ShareingService.SetActiveSinInsignUpTab('SingIn',localData.data.UserEmail);
    localStorage.removeItem('currentUser');
    this.router.navigate(['SignInSignUp']);
  }
}
