import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { ProfilePictureCropperComponent } from './../../popups/profile-picture-cropper/profile-picture-cropper.component';

@Component({
  selector: 'app-profile-left-bar',
  templateUrl: './profile-left-bar.component.html',
  styleUrls: ['./profile-left-bar.component.css']
})
export class ProfileLeftBarComponent implements OnInit {


  UserInfo: any[] = [];
  FollowingUsers: any[];
  FollowingTopics: any[];
  UserFollowingUsers: any[];
  LoderOne: Boolean = true;
  LoderTwo: Boolean = true;
  LoderThree: Boolean = true;
  UserId;
  LoginUser: Boolean = true;
  LoginUserFollow: Boolean = false;
  UserInfoLoading: Boolean = true;

  constructor(private cdRef: ChangeDetectorRef,
      private router: Router,
      private FollowService: FollowServiceService,
      private ShareingService: DataSharedVarServiceService,
      private UserService: SigninSignupServiceService,
      public dialog: MatDialog
    ) {

      const ProfilePage =  this.ShareingService.GetProfilePage();

      console.log(ProfilePage);

      const LoginUserIn = JSON.parse(localStorage.getItem('currentUser'));
      if (ProfilePage.UserId !== '' && ProfilePage.UserId !== LoginUserIn.data._id ) {
        this.UserId = ProfilePage.UserId;
        this.LoginUser = false;
          this.UserService.GetUserInfo(this.UserId, LoginUserIn.data._id )
          .subscribe( datas => {
              if (datas['status'] === 'True') {
                this.UserInfo = datas;
                this.UserInfoLoading = false;
                this.LoginUserFollow = this.UserInfo['data'].UserFollow;
                this.LoginUser = false;
              }else {
                console.log(datas);
              }
          });
      }else {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.UserInfoLoading = false;
        this.UserId = this.UserInfo['data']._id;
        this.LoginUser = true;
      }

        this.FollowService.FollowingTopics(this.UserId)
        .subscribe( topicdatas => {
            if (topicdatas['status'] === 'True') {
              this.LoderThree = false ;
              this.FollowingTopics = topicdatas['data'];
            }else {
              this.LoderThree = false ;
              console.log(topicdatas);
            }
        });

        this.FollowService.FollowingUsers(this.UserId)
        .subscribe( userdatas => {
            if (userdatas['status'] === 'True') {
              this.FollowingUsers = userdatas['data'];
              this.LoderTwo = false ;
            }else {
              this.LoderTwo = false ;
              console.log(userdatas);
            }
        });

        this.FollowService.UserFollowingUsers(this.UserId)
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
      const EditProfilePicDialogRef = this.dialog.open( ProfilePictureCropperComponent,
        {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Form', type: 'Creat Form' } });
        EditProfilePicDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
    }

    postSubmit(result) {
      if ( result === 'Close') {
        console.log(result);
      }else {
        this.UserInfo['data'].UserImage = result['data'].UserImage;
        this.cdRef.detectChanges();
      }
    }



    followUser(Id: String) {
      const LoginUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      const data =  { 'UserId' : LoginUserInfo.data._id, 'FollowingUserId' : this.UserInfo['data']._id };
        this.FollowService.FollowUser(data)
          .subscribe( datas => {
            if (datas['status'] === 'True') {
              this.UserInfo['data'].FollowDbId = datas['data']._id;
              this.LoginUserFollow = true;
            }else {
              console.log(datas);
            }
        });
    }

    UnfollowUser(Id: String) {
        this.FollowService.UnFollowUser(this.UserInfo['data'].FollowDbId)
          .subscribe( datas => {
            if (datas['status'] === 'True') {
              this.LoginUserFollow = false;
            }else {
              console.log(datas);
            }
        });
    }


  ngOnInit() {
  }



  GotoProfile(Id) {
    this.ShareingService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }



}
