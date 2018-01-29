import { Component, OnInit } from '@angular/core';

import { FollowServiceService } from "./../../service/follow-service/follow-service.service";

@Component({
  selector: 'app-feeds-right-bar',
  templateUrl: './feeds-right-bar.component.html',
  styleUrls: ['./feeds-right-bar.component.css']
})
export class FeedsRightBarComponent implements OnInit {

  UserInfo:any;
  FollowingUsers:any;
  FollowingTopics:any;
  UserFollowingUsers:any;

  constructor(private FollowService: FollowServiceService) {
                this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 
                this.FollowService.FollowingTopics(this.UserInfo.data._id).subscribe( topicdatas => this.FollowingTopics = topicdatas );
                this.FollowService.FollowingUsers(this.UserInfo.data._id).subscribe( userdatas => this.FollowingUsers = userdatas );
                this.FollowService.UserFollowingUsers(this.UserInfo.data._id).subscribe( userFollowdatas => this.UserFollowingUsers = userFollowdatas );
   }

  ngOnInit() {
    console.log(this.FollowingUsers);

  }

}
