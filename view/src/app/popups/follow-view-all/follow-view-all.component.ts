import { Component, Directive, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-follow-view-all',
  templateUrl: './follow-view-all.component.html',
  styleUrls: ['./follow-view-all.component.css']
})
export class FollowViewAllComponent implements OnInit {


  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  UserInfo: any;
  DiscoverPeoples: any[];
  DiscoverTopics: any[];
  Loader: Boolean = true;
  Header;

  constructor(private router: Router,
    private ShareService: DataSharedVarServiceService,
    private Service: FollowServiceService,
    private dialogRef: MatDialogRef<FollowViewAllComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.Header = this.data.Header;
        console.log(this.data);
        if ( this.data.type === 'FollowingTopics' ) {
          this.Service.AllFollowingTopics(this.data.Userid)
          .subscribe( datas =>  {
            if (datas['status'] === 'True') {
              this.Loader = false;
              this.DiscoverTopics = datas['data'];
            }else {
              this.Loader = false;
              console.log(datas);
            }
          });
        }
        if ( this.data.type === 'FollowingUsers' ) {
          this.Service.AllFollowingUsers(this.data.Userid)
          .subscribe( userdatas =>  {
            if (userdatas['status'] === 'True') {
              this.DiscoverPeoples = userdatas['data'];
              this.Loader = false;
            }else {
              this.Loader = false;
              console.log(userdatas);
            }
          });
        }
        if ( this.data.type === 'UserFollowingUsers' ) {
          this.Service.AllUserFollowingUsers(this.data.Userid)
          .subscribe( userdatas =>  {
            if (userdatas['status'] === 'True') {
              this.DiscoverPeoples = userdatas['data'];
              this.Loader = false;
            }else {
              this.Loader = false;
              console.log(userdatas);
            }
          });
        }


      }

  ngOnInit() {

  }

  // followUser(Id: String) {
  //   const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : Id };
  //   const index = this.DiscoverPeoples.findIndex(x => x._id === Id);
  //     this.Service.FollowUser(data)
  //       .subscribe( datas => {
  //         if (datas.status === 'True') {
  //           this.DiscoverPeoples.splice(index , 1);
  //         }else {
  //           console.log(datas);
  //         }
  //     });
  // }


  // followTopic(Id: String) {
  //   const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingTopicId' : Id };
  //   const index = this.DiscoverTopics.findIndex(x => x._id === Id);
  //     this.Service.FollowTopic(data)
  //       .subscribe( datas => {
  //         if (datas.status === 'True') {
  //           this.DiscoverTopics.splice(index , 1);
  //         }else {
  //           console.log(datas);
  //         }
  //     });
  // }


  close() {
    this.dialogRef.close({status: 'Close'});
  }

  GotoTopic(Id) {
    this.dialogRef.close({status: 'GoToTopic', topicId: Id});
  }
  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.dialogRef.close({status: 'GoToProfile', Id: Id});
  }

}
