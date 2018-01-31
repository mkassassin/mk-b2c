import { Component, OnInit } from '@angular/core';

import { FollowServiceService } from "./../../service/follow-service/follow-service.service";

@Component({
  selector: 'app-feeds-right-bar',
  templateUrl: './feeds-right-bar.component.html',
  styleUrls: ['./feeds-right-bar.component.css']
})
export class FeedsRightBarComponent implements OnInit {

  UserInfo:any;
  FollowingUsers:any[];
  FollowingTopics:any[];
  UserFollowingUsers:any[];
  TimeOut:boolean = true;

  constructor(private FollowService: FollowServiceService) {
                this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

                this.FollowService.FollowingTopics(this.UserInfo.data._id)
                .subscribe( topicdatas => {  
                    if(topicdatas['status'] == "True"){
                      this.FollowingTopics = topicdatas['data'];
                    }else{
                      console.log(topicdatas);
                    }
                });

                this.FollowService.FollowingUsers(this.UserInfo.data._id)
                .subscribe( userdatas => {  
                    if(userdatas['status'] == "True"){
                      this.FollowingUsers = userdatas['data'];
                    }else{
                      console.log(userdatas);
                    }
                });

                this.FollowService.UserFollowingUsers(this.UserInfo.data._id)
                .subscribe( userFollowdatas => {  
                    if(userFollowdatas['status'] == "True"){
                      this.UserFollowingUsers = userFollowdatas['data'];
                    }else{
                      console.log(userFollowdatas);
                    }
                });

                this.TimeOutFuction();
            }


  TimeOutFuction(){
      setTimeout(()=>{ this.TimeOut = false; },5000);
  }
  ngOnInit() {
  }

}
