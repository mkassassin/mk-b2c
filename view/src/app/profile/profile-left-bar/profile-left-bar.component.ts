import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { ProfilePictureCropperComponent } from './../../popups/profile-picture-cropper/profile-picture-cropper.component';
@Component({
  selector: 'app-profile-left-bar',
  templateUrl: './profile-left-bar.component.html',
  styleUrls: ['./profile-left-bar.component.css']
})
export class ProfileLeftBarComponent implements OnInit {


  UserInfo: any;
  FollowingUsers: any[];
  FollowingTopics: any[];
  UserFollowingUsers: any[];
  LoderOne: Boolean = true;
  LoderTwo: Boolean = true;
  LoderThree: Boolean = true;

  constructor(private FollowService: FollowServiceService, public dialog: MatDialog) {
                this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

                this.FollowService.FollowingTopics(this.UserInfo.data._id)
                .subscribe( topicdatas => {
                    if (topicdatas['status'] === 'True') {
                      this.LoderThree = false ;
                      this.FollowingTopics = topicdatas['data'];
                    }else {
                      this.LoderThree = false ;
                      console.log(topicdatas);
                    }
                });

                this.FollowService.FollowingUsers(this.UserInfo.data._id)
                .subscribe( userdatas => {
                    if (userdatas['status'] === 'True') {
                      this.FollowingUsers = userdatas['data'];
                      this.LoderTwo = false ;
                    }else {
                      this.LoderTwo = false ;
                      console.log(userdatas);
                    }
                });

                this.FollowService.UserFollowingUsers(this.UserInfo.data._id)
                .subscribe( userFollowdatas => {
                    if (userFollowdatas['status'] === 'True') {
                      this.UserFollowingUsers = userFollowdatas['data'];
                      this.LoderOne = false ;
                    }else {
                      this.LoderOne = false ;
                      console.log(userFollowdatas);
                    }
                });

            }


    EditProfilePic() {
      // const EditProfilePicDialogRef = this.dialog.open( ProfilePictureCropperComponent,
      //   {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Form', type: 'Creat Form' } });
      //   EditProfilePicDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
    }

    postSubmit(result) {
      console.log(result);
    }
  ngOnInit() {
  }


}
