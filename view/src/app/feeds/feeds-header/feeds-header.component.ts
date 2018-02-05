import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef } from '@angular/material';

import { DiscoverComponent } from './../../popups/discover/discover.component';
import { DataSharedVarServiceService } from "./../../service/data-shared-var-service/data-shared-var-service.service";
import { SigninSignupServiceService } from "./../../service/signin-signup-service/signin-signup-service.service";
import { HighlightsPostComponent } from './../../popups/posts/highlights-post/highlights-post.component';
import { QuestionsPostComponent } from './../../popups/posts/questions-post/questions-post.component';

@Component({
  selector: 'app-feeds-header',
  templateUrl: './feeds-header.component.html',
  styleUrls: ['./feeds-header.component.css']
})
export class FeedsHeaderComponent implements OnInit {

  UserInfo;
  NotificationList:any;
  NotificationLoder:boolean = true;

  constructor(private router: Router, 
    private ShareingService: DataSharedVarServiceService,
    private NotifyService: SigninSignupServiceService,
    public dialog: MatDialog) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 
          this.NotifyService.GetNotification(this.UserInfo.data._id)
          .subscribe( datas => {  
              if(datas['status'] == "True"){
                this.NotificationList = datas['data'];
                this.NotificationLoder = false;
              }else{
                console.log(datas);
              }
            });
     }

  // material dialog 
  DiscoverDialogRef: MatDialogRef<DiscoverComponent>;
  HighlightsPostDialogRef: MatDialogRef<HighlightsPostComponent>;
  QuestionsPostDialogRef : MatDialogRef<QuestionsPostComponent>


  ngOnInit() {
    
  }

  OpenModelDiscover() {
    let DiscoverDialogRef = this.dialog.open(DiscoverComponent, {disableClose:true, minWidth:'80%', position: {top: '50px'},  data: { Header:'Questions Post Two Form', type:'Creat Form' } });
    DiscoverDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  OpenModelHighlightsPost(PostId) {
    let HighlightsPostDialogRef = this.dialog.open(HighlightsPostComponent, {disableClose:true, minWidth:'60%', height:'90%', position: {top: '50px'},  data: { PostId: PostId } });
    HighlightsPostDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  OpenModelQuestionsPost(PostId) {
    let QuestionsPostDialogRef = this.dialog.open(QuestionsPostComponent, {disableClose:true, minWidth:'60%', height:'90%', position: {top: '50px'},  data: { PostId: PostId } });
    QuestionsPostDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  DiscoverClose(result){
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
