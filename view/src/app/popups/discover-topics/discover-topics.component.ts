import { Component, Directive, Inject, OnInit } from '@angular/core';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';

import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-discover-topics',
  templateUrl: './discover-topics.component.html',
  styleUrls: ['./discover-topics.component.css']
})
export class DiscoverTopicsComponent implements OnInit {

  UserInfo: any;
  DiscoverTopics: any[];
  LoadingTopics: Boolean = true;

  constructor(
    private Service: FollowServiceService,
    private dialogRef: MatDialogRef<DiscoverTopicsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.Service.DiscoverTopics(this.UserInfo.data._id)
        .subscribe( datas =>  {
          if (datas['status'] === 'True') {
            this.LoadingTopics = false;
            this.DiscoverTopics = datas['data'];
          }else {
            this.LoadingTopics = false;
            console.log(datas);
          }
        });


      }

  ngOnInit() {

  }

  followTopic(Id: String) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingTopicId' : Id };
    const index = this.DiscoverTopics.findIndex(x => x._id === Id);
      this.Service.FollowTopic(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.DiscoverTopics.splice(index , 1);
          }else {
            console.log(datas);
          }
      });
  }



  close() {
    this.dialogRef.close('Close');
  }
}
