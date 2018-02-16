import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';


import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { ProfileSerivceService } from './../../service/profile-service/profile-serivce.service';
import { LikeAndRatingServiceService } from './../../service/like-and-rating-service.service';
import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { ComponentConnectServiceService } from './../../service/component-connect-service.service';

import { ReportUserComponent } from './../../popups/report-user/report-user.component';
import { ReportPostComponent } from './../../popups/report-post/report-post.component';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.css']
})
export class ProfileTimelineComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  scrollHeight;
  screenHeight: number;
  anotherHeight: number;

  UserInfo: any[] = [];
  LoginUser: any[] = [];
  PostsList: any;
  ActiveComment;
  LoadingActiveComment;
  ActiveAnswerInput;
  PostsListLoder: Boolean = true;
  UserId;


  reportPostInfo;
  reportUserId;
  reportCommentInfo;
  reportAnswerInfo;


  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private UserService: SigninSignupServiceService,
    private Service: ProfileSerivceService,
    private ShareingService: DataSharedVarServiceService,
    private LikeService: LikeAndRatingServiceService,
    private commentservice: CommentAndAnswerService,
    private AnswerService: CommentAndAnswerService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private _componentConnectService: ComponentConnectServiceService
      ) {

        this.LoginUser = JSON.parse(localStorage.getItem('currentUser'));
      const ProfilePage =  this.ShareingService.GetProfilePage();

      if (ProfilePage.UserId !== '') {
        this.UserId = ProfilePage.UserId;

        this.UserService.GetUserInfo(this.UserId, this.LoginUser['data']._id )
          .subscribe( datas => {
              if (datas['status'] === 'True') {
                this.UserInfo = datas;
              }else {
                console.log(datas);
              }
          });
      }else {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.UserId = this.UserInfo['data']._id;
      }

        this.Service.Timeline(this.UserId)
        .subscribe( datas => {
            if (datas['status'] === 'True') {
              this.PostsList = datas['data'];
              this.PostsListLoder = false;
              const s = document.createElement('script');
                          s.type = 'text/javascript';
                          s.src = './../../../assets/html5gallery/html5gallery.js';
                          this.elementRef.nativeElement.appendChild(s);
            }else {
              console.log(datas);
            }
          });

          this._componentConnectService.listen().subscribe(() => {
            this.ReloadGalleryScript();
        });

       }


    ReloadGalleryScript() {
        const tempPostList = this.PostsList;
        this.PostsList = [];
        setTimeout(() => {
          this.PostsList = tempPostList;
          const s = document.createElement('script');
              s.type = 'text/javascript';
              s.src = './../../../assets/html5gallery/html5gallery.js';
              this.elementRef.nativeElement.appendChild(s);
        }, 50);
    }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 80;
    this.scrollHeight = this.screenHeight + 'px';
  }


  AddLike(index) {
    const data = {'UserId': this.UserInfo['data']._id,
                'PostId': this.PostsList[index]._id,
                'PostUserId':  this.PostsList[index].UserId,
                'Date':  new Date(),
              };
    this.LikeService.HighlightsLikeAdd(data).subscribe( datas => {
          if (datas['status'] === 'True' && !datas['message']) {
            console.log(datas['data']._id);
            this.PostsList[index].UserLiked = true;
            this.PostsList[index].UserLikeId = datas['data']._id;
            this.PostsList[index].LikesCount = this.PostsList[index].LikesCount + 1;
          }else {
            console.log(datas);
          }
        });
  }


  RemoveLike(index) {
    this.LikeService.HighlightsUnLike(this.PostsList[index].UserLikeId).subscribe( datas => {
          if (datas['status'] === 'True' && !datas['message']) {
            this.PostsList[index].UserLiked = false;
            this.PostsList[index].LikesCount = this.PostsList[index].LikesCount - 1;
          }else {
            console.log(datas);
          }
      });
  }


  ChangeActiveComment(index: string) {
    if (this.ActiveComment === index || this.LoadingActiveComment === index) {
      this.ActiveComment = -1;
      this.LoadingActiveComment = -1;
    }else {
      this.ActiveComment = index;
      this.LoadingActiveComment = index;
      this.PostsList[index].comments = [];
      this.commentservice.GetHighlightsComments(this.PostsList[index]._id, this.UserInfo['data']._id)
      .subscribe( newDatas => {
        this.LoadingActiveComment = -1;
        if (newDatas['status'] === 'True') {
          this.PostsList[index].comments = newDatas['data'];
        }else {
          console.log(newDatas);
        }
      });
    }
  }


  SubmitComment(comment, index) {
    if (comment !== '') {
    const data = {'UserId': this.UserInfo['data']._id,
              'PostId': this.PostsList[index]._id,
              'PostUserId':  this.PostsList[index].UserId,
              'CommentText': comment,
              'Date':  new Date(),
            };
            this.LoadingActiveComment = index;
            this.ActiveComment = index;
            this.PostsList[index].comments = [];
          this.commentservice.HighlightsCommentAdd(data).subscribe( datas => {
            if (datas['status'] === 'True' && !datas['message']) {
              this.PostsList[index].UserCommented = true;
                this.commentservice.GetHighlightsComments(this.PostsList[index]._id, this.UserInfo['data']._id)
                  .subscribe( newDatas => {
                    this.LoadingActiveComment = -1;
                    if (newDatas['status'] === 'True') {
                      this.PostsList[index].comments = newDatas['data'];
                      this.PostsList[index].commentsCount = this.PostsList[index].commentsCount + 1;
                    }else {
                      console.log(newDatas);
                    }
                  });
            }else {
                console.log(datas);
            }
          });
    }
  }



  FollowUser(UserId, postIndex, commentIndex) {
    const data =  { 'UserId' : this.UserInfo['data']._id, 'FollowingUserId' : UserId };
      this.FollowService.FollowUser(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.PostsList[postIndex].comments[commentIndex]['AlreadyFollow'] = true;
          }else {
            console.log(datas);
          }
      });
  }











  RatingImage(isActive: boolean) {
    return `assets/images/icons/like${isActive ? 'd' : ''}.png`;
  }



  ChangeActiveAnswerInput(index: string) {
    if (this.ActiveAnswerInput === index ) {
      this.ActiveAnswerInput = -1;
    }else {
      this.ActiveAnswerInput = index;
    }
  }


  rateChanging(index) {
    const data = {'UserId': this.UserInfo['data']._id,
      'PostId': this.PostsList[index]._id,
      'PostUserId':  this.PostsList[index].UserId,
      'Rating': this.PostsList[index].RatingCount,
      'Date':  new Date(),
    };
    this.LikeService.QuestionsRatingAdd(data).subscribe( datas => {
      if (datas['status'] === 'True' && !datas['message']) {
              if (datas['status'] === 'True') {
                this.PostsList[index].userRated = true;
                this.PostsList[index].userRating = datas['data'].Rating;
                this.PostsList[index].RatingCount = datas['data'].OverallRating;
              }else {
                console.log(datas);
              }
      }else {
          console.log(datas);
      }
    });

  }





  SubmitAnswer(answer, index) {
    if (answer !== '') {
    const data = {'UserId': this.UserInfo['data']._id,
              'PostId': this.PostsList[index]._id,
              'PostUserId':  this.PostsList[index].UserId,
              'AnswerText': answer,
              'Date':  new Date(),
            };

          this.AnswerService.QuestionsAnwerAdd(data).subscribe( datas => {
            if (datas['status'] === 'True' && !datas['message']) {
                    if (datas['status'] === 'True') {
                      let AnsData = new Array();
                      AnsData = datas['data'];
                      this.PostsList[index].Answers.splice(0, 0, AnsData);
                      this.PostsList[index].AnswersCount = this.PostsList[index].AnswersCount + 1;
                    }else {
                      console.log(datas);
                    }
            }else {
                console.log(datas);
            }
          });
    }
  }


  FollowUserQuestion(UserId, postIndex, answerIndex) {
    const data =  { 'UserId' : this.UserInfo['data']._id, 'FollowingUserId' : UserId };
      this.FollowService.FollowUser(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.PostsList[postIndex].Answers[answerIndex]['AlreadyFollow'] = true;
          }else {
            console.log(datas);
          }
      });
  }



  GotoProfile(Id) {
    this.ShareingService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }














  TriggerPostInfo(index) {
    this.reportPostInfo = this.PostsList[index];
    this.reportUserId = this.reportPostInfo.UserId;
  }

  TriggercommentInfo(index) {
    this.reportCommentInfo = this.PostsList[this.ActiveComment].comments[index];
    this.reportUserId = this.reportCommentInfo.UserId;
  }

  TriggerAnswerInfo(i, k) {
    this.reportPostInfo = this.PostsList[i];
    this.reportAnswerInfo = this.PostsList[i].Answers[k];
    this.reportUserId = this.reportAnswerInfo.UserId;
  }
  ReportUser() {
    const ReportUser = {'UserId': this.UserInfo['data']._id,
                        'ReportUserId':  this.reportUserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportUserComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { type: 'User', values: ReportUser  } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportPost() {
    const ReportPost = {'UserId': this.UserInfo['data']._id,
                        'PostType': this.reportPostInfo.Type,
                        'PostId':  this.reportPostInfo._id,
                        'PostUserId':  this.reportPostInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { type: 'Post', values: ReportPost } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportComment() {
    const ReportComment = { 'UserId': this.UserInfo['data']._id,
                        'PostId':  this.reportCommentInfo.PostId,
                        'SecondLevelPostType': 'Comment',
                        'SecondLevelPostId':  this.reportCommentInfo._id,
                        'SecondLevelPostUserId': this.reportCommentInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},
      data: { exactType: 'Comment', type: 'SecondLevelPost', values: ReportComment } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportAnswer() {
    const ReportComment = { 'UserId': this.UserInfo['data']._id,
                        'PostId':  this.reportPostInfo._id,
                        'SecondLevelPostType': 'Answer',
                        'SecondLevelPostId':  this.reportAnswerInfo._id,
                        'SecondLevelPostUserId': this.reportAnswerInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},
      data: { exactType: 'Answer', type: 'SecondLevelPost', values: ReportComment } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }
}
