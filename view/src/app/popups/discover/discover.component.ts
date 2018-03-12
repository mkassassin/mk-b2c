import { Component, Directive, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  UserInfo: any;
  DiscoverPeoples: any[];
  LoadingPeoples: Boolean = true;
  ActiveCategory = '01';
  Header;

  constructor(private router: Router,
    private ShareService: DataSharedVarServiceService,
    private Service: FollowServiceService,
    private dialogRef: MatDialogRef<DiscoverComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.ActiveCategory = this.data.ActiveCategory;
        this.Header = this.data.Header;
        this.Service.AllUnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
        .subscribe( userdatas =>  {
          if (userdatas['status'] === 'True') {
            this.DiscoverPeoples = userdatas['data'];
            this.LoadingPeoples = false;
          }else {
            this.LoadingPeoples = false;
            console.log(userdatas);
          }
        });


      }

  ngOnInit() {

  }

  followUser(Id: String) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : Id };
    const index = this.DiscoverPeoples.findIndex(x => x._id === Id);
      this.Service.FollowUser(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.DiscoverPeoples.splice(index , 1);
          }else {
            console.log(datas);
          }
      });
  }


  ActiveCategorySelect(id) {
    if (this.ActiveCategory !== id) {
      this.LoadingPeoples = true;
      this.DiscoverPeoples = [];
      this.ActiveCategory = id;
      this.Service.AllUnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
      .subscribe( userdatas =>  {
            if (userdatas['status'] === 'True') {
              this.DiscoverPeoples = userdatas['data'];
              this.LoadingPeoples = false;
            }else {
              console.log(userdatas);
            }
      });
    }
}


  close() {
    this.dialogRef.close({status: 'Close'});
  }


  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.dialogRef.close({status: 'GoToProfile', Id: Id});
  }

}
