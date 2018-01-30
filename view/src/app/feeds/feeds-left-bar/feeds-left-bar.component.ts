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
  TimeOut:boolean = true;
  UserTimeOut:boolean = true;
  ActiveCategory = "01";

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
                    
                    this.FollowService.UnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
                    .subscribe( userdatas =>  {  
                      if(userdatas['status'] == "True"){
                        this.UnfollowingUsers = userdatas['data'];
                      }else{
                        console.log(userdatas);
                      }
                    });

                    this.TimeOutFuction();
              }


  TimeOutFuction(){
      setTimeout(()=>{ this.TimeOut = false; this.UserTimeOut = false; },5000);
  }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 70;
    this.scrollHeight = this.screenHeight + "px";
  }

  ActiveCategorySelect(id){
      if(this.ActiveCategory != id){
        this.UserTimeOut = true;
        this.UnfollowingUsers = [];
        this.ActiveCategory = id; 
        this.FollowService.UnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
        .subscribe( userdatas =>  {  
              if(userdatas['status'] == "True"){
                this.UnfollowingUsers = userdatas['data'];
              }else{
                console.log(userdatas);
              }
        });
        this.TimeOutFuction();
      }
  }

  followTopic(Id:String){
    let data =  { "UserId" : this.UserInfo.data._id, "FollowingTopicId" : Id };
    var index = this.UnFollowingTopics.findIndex(x => x._id == Id);
      this.FollowService.FollowTopic(data)
        .subscribe( datas => { 
          if(datas.status == "True"){
            this.UnFollowingTopics.splice(index , 1);
          }else{
            console.log(datas);
          }
      });
  }

  followUser(Id:String){
    let data =  { "UserId" : this.UserInfo.data._id, "FollowingUserId" : Id };
    var index = this.UnfollowingUsers.findIndex(x => x._id == Id);
      this.FollowService.FollowUser(data)
        .subscribe( datas => { 
          if(datas.status == "True"){
            this.UnfollowingUsers.splice(index , 1);
          }else{
            console.log(datas);
          }
      });
  }


}
