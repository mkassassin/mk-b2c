import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { PostServiceService } from './../../service/post-service/post-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { ProfileSerivceService } from './../../service/profile-service/profile-serivce.service';
import { LikeAndRatingServiceService } from './../../service/like-and-rating-service.service';
import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { ComponentConnectServiceService } from './../../service/component-connect-service.service';
import { ReportUserComponent } from './../../popups/report-user/report-user.component';
import { ReportPostComponent } from './../../popups/report-post/report-post.component';
import { DeleteConfirmComponent } from './../../popups/delete-confirm/delete-confirm.component';
import { ReportAndDeleteService } from './../../service/report-and-delete-service/report-and-delete.service';
import { EditPostOneComponent } from './../../popups/edit-post-one/edit-post-one.component';
import { EditPostTwoComponent } from './../../popups/edit-post-two/edit-post-two.component';
import { EditAnswerComponent } from './../../popups/edit-answer/edit-answer.component';
import { EditCommentComponent } from './../../popups/edit-comment/edit-comment.component';

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
  AnswerListLoadingIndex: Number = -1;
  AnswersViewLess: Boolean = false;

  reportPostInfo;
  reportUserId;
  reportCommentInfo;
  reportAnswerInfo;

  CommentViewLess: Boolean = false;

  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private UserService: SigninSignupServiceService,
    private Service: ProfileSerivceService,
    private PostService: PostServiceService,
    private ShareingService: DataSharedVarServiceService,
    private LikeService: LikeAndRatingServiceService,
    private commentservice: CommentAndAnswerService,
    private AnswerService: CommentAndAnswerService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private _componentConnectService: ComponentConnectServiceService,
    private DeleteService: ReportAndDeleteService,
    public snackBar: MatSnackBar,
    private fb: FacebookService
    ) {
        this.LoginUser = JSON.parse(localStorage.getItem('currentUser'));
        const ProfilePage =  this.ShareingService.GetProfilePage();

        const initParams: InitParams = {
          appId: '202967426952150',
          xfbml: true,
          version: 'v2.11'
        };
        fb.init(initParams);

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


  share() {
    let SharePostImage = 'http://www.b2c.network/assets/images/icons/logo.png';
    if ( this.reportPostInfo.PostImage[0] !== '' ) {
      SharePostImage = 'http://139.59.20.129:3000/static/images/' + this.reportPostInfo.PostImage[0].ImageName;
    }
    const SharePostText = this.reportPostInfo.PostText;
    let SharePostTitle = this.reportPostInfo.PostText;
    if (SharePostText.length > 70 ) {
      SharePostTitle = this.reportPostInfo.PostText.substring(0, 70) + '...';
    }
    const ShareUrl = 'http://www.b2c.network/SharedPost/' + this.reportPostInfo._id + '/t_1';
    const params: UIParams = {
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
          object: {
              'og:url': ShareUrl,
              'og:title': SharePostTitle,
              'og:description': SharePostText,
              'og:image': SharePostImage,
          }
        })
      };

    this.fb.ui(params)
      .then((res: UIResponse) => {
        if ( res['error_code'] !== '' && res['error_code']  ) {
          console.log(res);
        }else {
          const SharePost = { 'UserId': this.LoginUser['data']._id,
                    'PostUserId': this.reportPostInfo.UserId,
                    'PostId':  this.reportPostInfo._id,
                  };
            this.PostService.HighlightsFBPostShare(SharePost).subscribe(datas => {
              if (datas['status'] === 'True') {
                const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
                this.PostsList[index].UserShared = true;
                this.PostsList[index].ShareCount = this.PostsList[index].ShareCount + 1;
                this.snackBar.open( ' Post Successfully Shared in Facebook', ' ', {
                horizontalPosition: 'center',
                duration: 3000,
                verticalPosition: 'top',
                });
              }else {
                console.log(datas);
              }
            });
          }
      })
      .catch((e: any) => {
        this.snackBar.open( 'Facebook Post Share Failed', ' ', {
          horizontalPosition: 'center',
          duration: 3000,
          verticalPosition: 'top',
        });
        console.log(e);
      });
  }


  shareInternal() {
    const SharePost = {'UserId': this.LoginUser['data']._id,
                        'ShareUserName': this.reportPostInfo.UserName,
                        'PostId':  this.reportPostInfo._id,
                        'PostDate':  new Date()
                      };
    this.PostService.HighlightsPostShare(SharePost).subscribe(datas => {
      const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
      this.PostsList[index].UserShared = true;
      this.PostsList[index].ShareCount = this.PostsList[index].ShareCount + 1;
      if (datas.status === 'True') {
        this.snackBar.open( ' Post Successfully Shared in B2C', ' ', {
          horizontalPosition: 'center',
          duration: 3000,
          verticalPosition: 'top',
        });
      }else {
        this.snackBar.open( 'B2C Post Share Failed', ' ', {
          horizontalPosition: 'center',
          duration: 3000,
          verticalPosition: 'top',
        });
        console.log(datas);
      }
    });
  }


  Qusshare() {
    let SharePostImage = 'http://www.b2c.network/assets/images/icons/logo.png';
    if ( this.reportPostInfo.PostImage[0] !== '' ) {
      SharePostImage = 'http://139.59.20.129:3000/static/images/' + this.reportPostInfo.PostImage[0].ImageName;
    }
    const SharePostText = this.reportPostInfo.PostText;
    let SharePostTitle = this.reportPostInfo.PostText;
    if (SharePostText.length > 70 ) {
      SharePostTitle = this.reportPostInfo.PostText.substring(0, 70) + '...';
    }
    const ShareUrl = 'http://www.b2c.network/SharedPost/' + this.reportPostInfo._id + '/t_2';
    const params: UIParams = {
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
          object: {
              'og:url': ShareUrl,
              'og:title': SharePostTitle,
              'og:description': SharePostText,
              'og:image': SharePostImage,
          }
        })
      };

    this.fb.ui(params)
      .then((res: UIResponse) => {
        if ( res['error_code'] !== '' && res['error_code'] ) {
          console.log(res);
        }else {
          const SharePost = { 'UserId':  this.LoginUser['data']._id,
                              'PostUserId': this.reportPostInfo.UserId,
                              'PostId':  this.reportPostInfo._id,
                            };
          this.PostService.QuestionsFBPostShare(SharePost).subscribe(datas => {
            if (datas['status'] === 'True') {
              const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
              this.PostsList[index].UserShared = true;
              this.PostsList[index].ShareCount = this.PostsList[index].ShareCount + 1;
              this.snackBar.open( ' Post Successfully Shared in Facebook', ' ', {
                horizontalPosition: 'center',
                duration: 3000,
                verticalPosition: 'top',
              });
            }else {
              console.log(datas);
            }
          });
        }
      })
      .catch((e: any) => {
        this.snackBar.open( 'Facebook Post Share Failed', ' ', {
          horizontalPosition: 'center',
          duration: 3000,
          verticalPosition: 'top',
        });
        console.log(e);
      });
  }


  QusshareInternal() {
    const SharePost = {'UserId':  this.LoginUser['data']._id,
                        'ShareUserName': this.reportPostInfo.UserName,
                        'PostId':  this.reportPostInfo._id,
                        'PostDate':  new Date()
                      };
    this.PostService.QuestionsPostShare(SharePost).subscribe(datas => {
      if (datas.status === 'True') {
        this.snackBar.open( ' Post Successfully Shared in B2C', ' ', {
          horizontalPosition: 'center',
          duration: 3000,
          verticalPosition: 'top',
        });
        const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
        this.PostsList[index].UserShared = true;
        this.PostsList[index].ShareCount = this.PostsList[index].ShareCount + 1;
        this.PostsList.splice(0 , 0, datas.data);
      }else {
        this.snackBar.open( 'B2C Post Share Failed', ' ', {
          horizontalPosition: 'center',
          duration: 3000,
          verticalPosition: 'top',
        });
        console.log(datas);
      }
    });
  }



  AddCommentLike(index, commentIndex) {
    const data = {'UserId': this.UserInfo['data']._id,
                'PostId': this.PostsList[index]._id,
                'CommentId': this.PostsList[index].comments[commentIndex]._id,
                'CommentUserId':  this.PostsList[index].comments[commentIndex].UserId,
                'Date':  new Date(),
              };
    this.LikeService.CommentsLikeAdd(data).subscribe( datas => {
          if (datas['status'] === 'True' && !datas['message']) {
            this.PostsList[index].comments[commentIndex].UserLiked = true;
            this.PostsList[index].comments[commentIndex].UserLikeId = datas['data']._id;
            this.PostsList[index].comments[commentIndex].LikesCount =  this.PostsList[index].comments[commentIndex].LikesCount + 1;
          }else {
            console.log(datas);
          }
        });
  }


  RemoveCommentLike(index, commentIndex) {
    this.LikeService.CommentsUnLike(this.PostsList[index].comments[commentIndex].UserLikeId).subscribe( datas => {
          if (datas['status'] === 'True' && !datas['message']) {
            this.PostsList[index].comments[commentIndex].UserLiked = false;
            this.PostsList[index].comments[commentIndex].LikesCount = this.PostsList[index].comments[commentIndex].LikesCount - 1;
          }else {
            console.log(datas);
          }
      });
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
    this.CommentViewLess = false;
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


  ViewAllComments(index: string) {
    this.ActiveComment = index;
    this.LoadingActiveComment = index;
    this.PostsList[index].comments = [];
    this.commentservice.GetHighlightsAllComments(this.PostsList[index]._id, this.UserInfo['data']._id)
    .subscribe( newDatas => {
      this.LoadingActiveComment = -1;
      if (newDatas['status'] === 'True') {
        this.CommentViewLess = true;
        this.PostsList[index].comments = newDatas['data'];
      }else {
        console.log(newDatas);
      }
    });
}


  SubmitComment(comment, index) {
    this.CommentViewLess = false;
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


  AnswerRateChanging(index, AnsIndex) {
    const data = {'UserId': this.UserInfo['data']._id,
          'PostId': this.PostsList[index]._id,
          'AnswerId': this.PostsList[index].Answers[AnsIndex]._id,
          'AnswerUserId':  this.PostsList[index].Answers[AnsIndex].UserId,
          'Rating': this.PostsList[index].Answers[AnsIndex].RatingCount,
          'Date':  new Date(),
        };
    this.LikeService.AnswerRatingAdd(data).subscribe( datas => {
      if (datas['status'] === 'True' && !datas['message']) {
              if (datas['status'] === 'True') {
                this.PostsList[index].Answers[AnsIndex].userRated = true;
                this.PostsList[index].Answers[AnsIndex].userRating = datas['data'].Rating;
                this.PostsList[index].Answers[AnsIndex].RatingCount = datas['data'].OverallRating;
              }else {
                console.log(datas);
              }
      }else {
          console.log(datas);
      }
    });
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


  ViewLessAnswers(index) {
    this.AnswersViewLess = false;
    this.PostsList[index].Answers.splice(2, (this.PostsList[index].Answers).length );
 }


  ViewAllAnswers(index) {
     const PostId = this.PostsList[index]._id;
     this.AnswerListLoadingIndex = index;
      this.AnswerService.GetQuestionsAllAnswers(PostId, this.UserInfo['data']._id).subscribe( datas => {
        if (datas['status'] === 'True') {
            let AnsData = new Array();
            AnsData = datas['data'];
            this.AnswerListLoadingIndex = -1;
            this.AnswersViewLess = true;
            this.PostsList[index].Answers = AnsData;
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

          this.AnswerService.QuestionsAnswerAdd(data).subscribe( datas => {
            if (datas['status'] === 'True' && !datas['message']) {
                    if (datas['status'] === 'True') {
                      let AnsData = new Array();
                      AnsData = datas['data'];
                      this.PostsList[index].Answers.splice(0, 0, AnsData);
                      this.PostsList[index].Answers.splice(2, (this.PostsList[index].Answers).length );
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


  GotoTopic(Id) {
    this.ShareingService.SetTopicQuestions(Id);
    this.router.navigate(['TopicPage']);
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
      {disableClose: true, maxWidth: '99%', position: {top: '50px'},  data: { type: 'User', values: ReportUser  } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportPost() {
    const ReportPost = {'UserId': this.UserInfo['data']._id,
                        'PostType': this.reportPostInfo.Type,
                        'PostId':  this.reportPostInfo._id,
                        'PostUserId':  this.reportPostInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'},  data: { type: 'Post', values: ReportPost } });
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
      {disableClose: true, maxWidth: '99%', position: {top: '50px'},
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
      {disableClose: true, maxWidth: '99%', position: {top: '50px'},
      data: { exactType: 'Answer', type: 'SecondLevelPost', values: ReportComment } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }


  DeleteHipost() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', data: { text: 'Are You Sure You Want To Permanently Delete This Post?'  } });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {
          const DeletePostdata =  { 'UserId' : this.LoginUser['data']._id, 'PostId' : this.reportPostInfo._id };
          this.DeleteService.DeleteHighlightPost(DeletePostdata)
            .subscribe( datas => {
              if (datas.status === 'True') {
                const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
                this.PostsList.splice(index , 1);
                this.snackBar.open( 'Your Highlight Post Deleted Successfully', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
              }else {
                this.snackBar.open( ' Post Delete Failed', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
                console.log(datas);
              }
          });
        }
      });
  }



  DeleteComment() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', data: {text: 'Are You Sure You Want To Permanently Delete This Comment?'} });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {
          const DeletePostdata =  { 'UserId' : this.UserInfo['data']._id, 'CommentId' : this.reportCommentInfo._id };
          this.DeleteService.DeleteComment(DeletePostdata)
            .subscribe( datas => {
              if (datas.status === 'True') {
                const index = this.PostsList[this.ActiveComment].comments.findIndex(x => x._id === this.reportCommentInfo._id);
                this.PostsList[this.ActiveComment].comments.splice(index , 1);
                this.PostsList[this.ActiveComment].commentsCount = this.PostsList[this.ActiveComment].commentsCount - 1;
                const OldActiveComment = this.ActiveComment;
                this.ActiveComment = -1;
                this.ChangeActiveComment(OldActiveComment);
                this.snackBar.open( 'Your Comment Deleted Successfully', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
              }else {
                this.snackBar.open( ' Comment Delete Failed', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
                console.log(datas);
              }
          });
        }
      });
  }



  DeleteQusPost() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', data: { text: 'Are You Sure You Want To Permanently Delete This Post?'  } });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {
          const DeletePostdata =  { 'UserId' : this.UserInfo['data']._id, 'PostId' : this.reportPostInfo._id };
          this.DeleteService.DeleteQuestionPost(DeletePostdata)
            .subscribe( datas => {
              if (datas.status === 'True') {
                const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
                this.PostsList.splice(index , 1);
                this.snackBar.open( 'Your Question Post Deleted Successfully', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
              }else {
                this.snackBar.open( ' Post Delete Failed', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
                console.log(datas);
              }
          });
        }
      });
  }


  DeleteAnswer() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', data: {text: 'Are You Sure You Want To Permanently Delete This Answer?'} });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {
          const DeletePostdata =  { 'UserId' : this.UserInfo['data']._id, 'AnswerId' : this.reportAnswerInfo._id };
          this.DeleteService.DeleteAnswer(DeletePostdata)
            .subscribe( datas => {
              if (datas.status === 'True') {
                const Postindex = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
                const index = this.reportPostInfo.Answers.findIndex(x => x._id === this.reportAnswerInfo._id);
                this.PostsList[Postindex].Answers.splice(index , 1);
                this.PostsList[Postindex].AnswersCount = this.PostsList[Postindex].AnswersCount - 1;

                if ( !this.AnswersViewLess && this.PostsList[Postindex].AnswersCount > 1 ) {
                  const PostId = this.PostsList[Postindex]._id;
                    this.AnswerService.GetQuestionsAnswers(PostId, this.UserInfo['data']._id).subscribe( newdatas => {
                      if (newdatas['status'] === 'True') {
                          let AnsData = new Array();
                          AnsData = newdatas['data'];
                          this.PostsList[Postindex].Answers = AnsData;
                      }else {
                          console.log(datas);
                      }
                    });
                }

                this.snackBar.open( 'Your Answer Deleted Successfully', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
              }else {
                this.snackBar.open( ' Answer Delete Failed', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
                console.log(datas);
              }
          });
        }
      });
  }


  EditHighlightPost() {
    const EditPostDialogRef = this.dialog.open( EditPostOneComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'}, data: { data: this.reportPostInfo } });
      EditPostDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const index = this.PostsList.findIndex(x => x._id === result._id);
          this.PostsList[index].PostType = result.PostType;
          this.PostsList[index].PostDate = result.PostDate;
          this.PostsList[index].PostText = result.PostText;
          this.PostsList[index].PostLink = result.PostLink;
          this.PostsList[index].PostImage = result.PostImage;
          this.PostsList[index].PostVideo = result.PostVideo;
          this.PostsList[index].PostLinkInfo = result.PostLinkInfo;
          this.ReloadGalleryScript();
        }
      });
  }

  EditComment() {
    const EditCommentDialogRef = this.dialog.open( EditCommentComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'}, data: { data: this.reportCommentInfo } });
      EditCommentDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const index = this.PostsList[this.ActiveComment].comments.findIndex(x => x._id === result._id);
          this.PostsList[this.ActiveComment].comments[index].CommentText = result.CommentText;
        }
      });
  }



  EditQuestionPost() {
    const EditPostDialogRef = this.dialog.open( EditPostTwoComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'}, data: { data: this.reportPostInfo } });
      EditPostDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const index = this.PostsList.findIndex(x => x._id === result._id);
          this.PostsList[index].PostTopicId = result.PostTopicId;
          this.PostsList[index].PostTopicName = result.PostTopicName;
          this.PostsList[index].PostDate = result.PostDate;
          this.PostsList[index].PostText = result.PostText;
          this.PostsList[index].PostLink = result.PostLink;
          this.PostsList[index].PostImage = result.PostImage;
          this.PostsList[index].PostVideo = result.PostVideo;
          this.PostsList[index].PostLinkInfo = result.PostLinkInfo;
          this.ReloadGalleryScript();
        }
      });
  }

  EditAnswer() {
    const EditCommentDialogRef = this.dialog.open( EditAnswerComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'}, data: { data: this.reportAnswerInfo } });
      EditCommentDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const Postindex = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
          const index = this.reportPostInfo.Answers.findIndex(x => x._id === result._id);
          this.PostsList[Postindex].Answers[index].AnswerText = result.AnswerText;
        }
      });
  }

}
