import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { ProfilePictureCropperComponent } from './../../popups/profile-picture-cropper/profile-picture-cropper.component';
import { EditProfileComponent } from './../../popups/edit-profile/edit-profile.component';
import { ProfilePrivacyComponent } from './../../popups/profile-privacy/profile-privacy.component';
import { ChangePasswordComponent } from './../../popups/change-password/change-password.component';
import { FollowViewAllComponent } from './../../popups/follow-view-all/follow-view-all.component';

import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile-left-bar',
  templateUrl: './profile-left-bar.component.html',
  styleUrls: ['./profile-left-bar.component.css']
})
export class ProfileLeftBarComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

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

  LoginUserInfo;

  constructor(private cdRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,
      private router: Router,
      private FollowService: FollowServiceService,
      private ShareingService: DataSharedVarServiceService,
      private UserService: SigninSignupServiceService,
      public dialog: MatDialog
    ) {

      const ProfilePage =  this.ShareingService.GetProfilePage();

       this.LoginUserInfo = JSON.parse(localStorage.getItem('currentUser'));

      if (ProfilePage.UserId !== '' && ProfilePage.UserId !== this.LoginUserInfo.data._id ) {
        this.UserId = ProfilePage.UserId;
        this.LoginUser = false;
          this.UserService.GetUserInfo(this.UserId, this.LoginUserInfo.data._id )
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
            }
        });

        this.FollowService.UserFollowingUsers(this.UserId)
        .subscribe( userFollowdatas => {
            if (userFollowdatas['status'] === 'True') {
              this.UserFollowingUsers = userFollowdatas['data'];
              this.LoderOne = false ;
            }else {
              this.LoderOne = false ;
            }
        });

    }


    EditProfilePic() {
      const EditProfilePicDialogRef = this.dialog.open( ProfilePictureCropperComponent,
        {disableClose: true, minWidth: '500px', position: {top: '50px'},  data: { Header: 'Form', type: 'Creat Form' } });
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
      this.LoginUserInfo = JSON.parse(localStorage.getItem('currentUser'));
      const data =  { 'UserId' : this.LoginUserInfo.data._id, 'FollowingUserId' : this.UserInfo['data']._id };
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



  AllFollowingTopics() {
    const DiscoverDialogRef = this.dialog.open(
      FollowViewAllComponent, {disableClose: true, maxWidth: '99%', position: {top: '50px'},
      data: { Header: 'Following Topics', Userid: this.UserInfo['data']._id, type: 'FollowingTopics'} }
    );
    DiscoverDialogRef.afterClosed().subscribe(result => {
      if (result.status === 'GoToTopic') {
        this.ShareingService.SetTopicQuestions(result.topicId);
        this.router.navigate(['TopicPage']);
      }
    });
  }

  AllFollowingUsers() {
    const DiscoverDialogRef = this.dialog.open(
      FollowViewAllComponent, {disableClose: true, maxWidth: '99%', position: {top: '50px'},
      data: { Header: 'Following People', Userid: this.UserInfo['data']._id, type: 'FollowingUsers'} }
    );
    DiscoverDialogRef.afterClosed().subscribe(result => {
      if (result.status === 'GoToProfile') {
        console.log('Go to Profile Page');
        this.GotoProfile(result.Id);
      }
    });
  }



  AllUserFollowingUsers() {
    const DiscoverDialogRef = this.dialog.open(
      FollowViewAllComponent, {disableClose: true, maxWidth: '99%', position: {top: '50px'},
      data: { Header: 'Followed By', Userid: this.UserInfo['data']._id, type: 'UserFollowingUsers'} }
    );
    DiscoverDialogRef.afterClosed().subscribe(result => {
      if (result.status === 'GoToProfile') {
        console.log('Go to Profile Page');
        this.GotoProfile(result.Id);
      }
    });
  }


  GotoProfile(Id) {
    this.ShareingService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }


  EditProfile() {
    const EditProfileDialogRef = this.dialog.open( EditProfileComponent,
      {disableClose: true, minWidth: '600px', position: {top: '50px'},  data: { Header: 'Form', type: 'Creat Form' } });
      EditProfileDialogRef.afterClosed().subscribe( result => {
        if ( result === 'Success' ) {
          this.snackBar.open( 'Profile Successfully Updated ', '', {
            horizontalPosition: 'center',
            duration: 2000,
            verticalPosition: 'top',
          });
          this.UserInfo['data'].UserProfession = result.data.UserProfession;
          this.UserInfo['data'].UserCompany = result.data.UserCompany;
        }else if ( result === 'Close' ) {
          this.snackBar.open( 'Profile Edit Closed ', '', {
            horizontalPosition: 'center',
            duration: 1000,
            verticalPosition: 'top',
          });
        }else {
          this.snackBar.open( 'Profile Update Failed ', '', {
            horizontalPosition: 'center',
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      });
  }


  PrivacySettings() {
    const ProfilePrivacyDialogRef = this.dialog.open( ProfilePrivacyComponent,
      {disableClose: true, minWidth: '500px', position: {top: '50px'},  data: { Header: 'Form', type: 'Creat Form' } });
      ProfilePrivacyDialogRef.afterClosed().subscribe( result => {
        if ( result === 'Success' ) {
          this.snackBar.open( ' Privacy Settings Updated ', '', {
            horizontalPosition: 'center',
            duration: 3000,
            verticalPosition: 'top',
          });
        }else if ( result === 'Close' ) {
          this.snackBar.open( 'Privacy Settings Closed ', '', {
            horizontalPosition: 'center',
            duration: 1000,
            verticalPosition: 'top',
          });
        }else {
          this.snackBar.open( 'Privacy Settings Update Failed ', '', {
            horizontalPosition: 'center',
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      });
  }


  PasswordChange() {
    const ChangePasswordDialogRef = this.dialog.open( ChangePasswordComponent,
      {disableClose: true, minWidth: '500px', position: {top: '50px'},  data: { Header: 'Form', type: 'Creat Form' } });
      ChangePasswordDialogRef.afterClosed().subscribe( result => {
        if ( result === 'Success' ) {
          this.snackBar.open( ' New Password Updated ', '', {
            horizontalPosition: 'center',
            duration: 3000,
            verticalPosition: 'top',
          });
        }else if ( result === 'Close' ) {
          this.snackBar.open( 'Password Change Closed ', '', {
            horizontalPosition: 'center',
            duration: 1000,
            verticalPosition: 'top',
          });
        }else {
          this.snackBar.open( 'New Password Update Failed ', '', {
            horizontalPosition: 'center',
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      });
  }



  GotoTopic(Id) {
    this.ShareingService.SetTopicQuestions(Id);
    this.router.navigate(['TopicPage']);
  }


}
