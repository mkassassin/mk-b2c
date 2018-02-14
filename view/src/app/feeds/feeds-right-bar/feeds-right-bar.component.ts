import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { ProfilePictureCropperComponent } from './../../popups/profile-picture-cropper/profile-picture-cropper.component';

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
  LoderOne: Boolean = true;
  LoderTwo: Boolean = true;
  LoderThree: Boolean = true;

  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService,
    public dialog: MatDialog) {
                this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

                this.FollowService.FollowingTopics(this.UserInfo.data._id)
                .subscribe( topicdatas => {
                    if (topicdatas['status'] === 'True') {
                      this.LoderThree = false;
                      this.FollowingTopics = topicdatas['data'];
                    }else {
                      this.LoderThree = false;
                      console.log(topicdatas);
                    }
                });

                this.FollowService.FollowingUsers(this.UserInfo.data._id)
                .subscribe( userdatas => {
                    if (userdatas['status'] === 'True') {
                      this.LoderTwo = false;
                      this.FollowingUsers = userdatas['data'];
                    }else {
                      this.LoderTwo = false;
                      console.log(userdatas);
                    }
                });

                this.FollowService.UserFollowingUsers(this.UserInfo.data._id)
                .subscribe( userFollowdatas => {
                    if (userFollowdatas['status'] === 'True') {
                      this.LoderOne = false;
                      this.UserFollowingUsers = userFollowdatas['data'];
                    }else {
                      this.LoderOne = false;
                      console.log(userFollowdatas);
                    }
                });

            }



  ngOnInit() {
  }


  EditProfilePic() {
    const EditProfilePicDialogRef = this.dialog.open( ProfilePictureCropperComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Form', type: 'Creat Form' } });
      EditProfilePicDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result) {
    if ( result === 'Close') {
      console.log(result);
    }else {
      // this.UserInfo['data'].UserImage = result['data'].UserImage;
    }
  }

  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['Profile']);
  }



}
