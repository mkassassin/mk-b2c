import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef } from '@angular/material';

import { DiscoverComponent } from './../../popups/discover/discover.component';
import { DataSharedVarServiceService } from "./../../service/data-shared-var-service/data-shared-var-service.service";

@Component({
  selector: 'app-feeds-header',
  templateUrl: './feeds-header.component.html',
  styleUrls: ['./feeds-header.component.css']
})
export class FeedsHeaderComponent implements OnInit {

  constructor(private router: Router, 
    private ShareingService: DataSharedVarServiceService,
    public dialog: MatDialog) { }

  // material dialog 
  DiscoverDialogRef: MatDialogRef<DiscoverComponent>;


  ngOnInit() {
  }

  OpenModelDiscover() {
    let DiscoverDialogRef = this.dialog.open(DiscoverComponent, {disableClose:true, minWidth:'80%', position: {top: '50px'},  data: { Header:'Questions Post Two Form', type:'Creat Form' } });
    DiscoverDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result){
    console.log(result);
    if(result === "Close"){
      console.log('Post Not Submit Properly');
    }else{
      console.log('Post Submited');
    }
  }

  LogOut(){
    let localDataString = localStorage.getItem('currentUser');
    let localData = JSON.parse(localDataString);
    this.ShareingService.SetActiveSinInsignUpTab('SingIn',localData.data.UserEmail);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('UserToken');
    this.router.navigate(['SignInSignUp']);
  }
}
