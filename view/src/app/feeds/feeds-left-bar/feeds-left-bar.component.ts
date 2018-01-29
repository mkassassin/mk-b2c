import { Component, OnInit } from '@angular/core';

import { FollowServiceService } from "./../../service/follow-service/follow-service.service";


@Component({
  selector: 'app-feeds-left-bar',
  templateUrl: './feeds-left-bar.component.html',
  styleUrls: ['./feeds-left-bar.component.css']
})
export class FeedsLeftBarComponent implements OnInit {

  scrollHeight;
  screenHeight:number;
  UserInfo:any;
  UnfollowingUsers:any[];
  UnFollowingTopics:any[];


  constructor(private FollowService: FollowServiceService) { 
                    this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

                    this.FollowService.UnFollowingTopics(this.UserInfo.data._id)
                    .subscribe( topicdatas => {  
                        if(topicdatas['status'] == "True"){
                          this.UnFollowingTopics = topicdatas['data'];
                        }else{
                          console.log(topicdatas);
                        }
                      });
                    
                    this.FollowService.UnFollowingUsers(this.UserInfo.data._id)
                    .subscribe( userdatas =>  {  
                      if(userdatas['status'] == "True"){
                        this.UnfollowingUsers = userdatas['data'];
                      }else{
                        console.log(userdatas);
                      }
                    });
              }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 70;
    this.scrollHeight = this.screenHeight + "px";
  }

}
