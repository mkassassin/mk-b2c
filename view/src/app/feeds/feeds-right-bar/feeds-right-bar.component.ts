import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';

@Component({
  selector: 'app-feeds-right-bar',
  templateUrl: './feeds-right-bar.component.html',
  styleUrls: ['./feeds-right-bar.component.css']
})
export class FeedsRightBarComponent implements OnInit {


  UserInfo: any;
  FollowingUsers: any[];
  FollowingTopics: any[];
  UserFollowingUsers: any[];
  TimeOut: Boolean = true;

  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService) {
                this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

                this.FollowService.FollowingTopics(this.UserInfo.data._id)
                .subscribe( topicdatas => {
                    if (topicdatas['status'] === 'True') {
                      this.FollowingTopics = topicdatas['data'];
                    }else {
                      console.log(topicdatas);
                    }
                });

                this.FollowService.FollowingUsers(this.UserInfo.data._id)
                .subscribe( userdatas => {
                    if (userdatas['status'] === 'True') {
                      this.FollowingUsers = userdatas['data'];
                    }else {
                      console.log(userdatas);
                    }
                });

                this.FollowService.UserFollowingUsers(this.UserInfo.data._id)
                .subscribe( userFollowdatas => {
                    if (userFollowdatas['status'] === 'True') {
                      this.UserFollowingUsers = userFollowdatas['data'];
                    }else {
                      console.log(userFollowdatas);
                    }
                });

                this.TimeOutFuction();
            }


  TimeOutFuction() {
      setTimeout(() => { this.TimeOut = false; }, 5000);
  }
  ngOnInit() {
  }


  
  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['Profile']);
  }

  

}
