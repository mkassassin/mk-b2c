import { Component, Directive, Inject, OnInit } from '@angular/core';

import { FollowServiceService } from "./../../service/follow-service/follow-service.service";

import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  UserInfo:any;
  DiscoverPeoples:any[];
  DiscoverTopics:any[];
  LoadingPeoples:boolean = true;
  LoadingTopics:boolean = true;
  ActiveCategory = "01";

  constructor(
    private Service: FollowServiceService,
    private dialogRef: MatDialogRef<DiscoverComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.Service.UnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
        .subscribe( userdatas =>  { 
          if(userdatas['status'] == "True"){
            this.DiscoverPeoples = userdatas['data'];
            this.LoadingPeoples = false;
          }else{
            this.LoadingPeoples = false;
            console.log(userdatas);
          }
        });

        this.Service.DiscoverTopics(this.UserInfo.data._id)
        .subscribe( datas =>  {  
          if(datas['status'] == "True"){
            this.LoadingTopics = false;
            this.DiscoverTopics = datas['data'];
          }else{
            this.LoadingTopics = false;
            console.log(datas);
          }
        });


      }

  ngOnInit() {

  }

  followUser(Id:String){
    let data =  { "UserId" : this.UserInfo.data._id, "FollowingUserId" : Id };
    var index = this.DiscoverPeoples.findIndex(x => x._id == Id);
      this.Service.FollowUser(data)
        .subscribe( datas => { 
          if(datas.status == "True"){
            this.DiscoverPeoples.splice(index , 1);
          }else{
            console.log(datas);
          }
      });
  }

  followTopic(Id:String){
    let data =  { "UserId" : this.UserInfo.data._id, "FollowingTopicId" : Id };
    var index = this.DiscoverTopics.findIndex(x => x._id == Id);
      this.Service.FollowTopic(data)
        .subscribe( datas => { 
          if(datas.status == "True"){
            this.DiscoverTopics.splice(index , 1);
          }else{
            console.log(datas);
          }
      });
  }


  ActiveCategorySelect(id){
    if(this.ActiveCategory != id){
      this.LoadingPeoples = true;
      this.DiscoverPeoples = [];
      this.ActiveCategory = id; 
      this.Service.UnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
      .subscribe( userdatas =>  {  
            if(userdatas['status'] == "True"){
              this.DiscoverPeoples = userdatas['data'];
              this.LoadingPeoples = false;
            }else{
              console.log(userdatas);
            }
      });
    }
}


  close() {
    this.dialogRef.close('Close');
  }

}
