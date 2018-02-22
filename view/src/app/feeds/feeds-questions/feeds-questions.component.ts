import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { PostTwoComponent } from './../../popups/post-two/post-two.component';
import { PostServiceService } from './../../service/post-service/post-service.service';
import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';
import { LikeAndRatingServiceService } from './../../service/like-and-rating-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { ComponentConnectServiceService } from './../../service/component-connect-service.service';
import { ReportUserComponent } from './../../popups/report-user/report-user.component';
import { ReportPostComponent } from './../../popups/report-post/report-post.component';
import { DeleteConfirmComponent } from './../../popups/delete-confirm/delete-confirm.component';
import { ReportAndDeleteService } from './../../service/report-and-delete-service/report-and-delete.service';
import { EditPostTwoComponent } from './../../popups/edit-post-two/edit-post-two.component';
import { EditAnswerComponent } from './../../popups/edit-answer/edit-answer.component';

import { TopicRoutingServiceService } from './../../service/topic-routing-service/topic-routing-service.service';

@Component({
  selector: 'app-feeds-questions',
  templateUrl: './feeds-questions.component.html',
  styleUrls: ['./feeds-questions.component.css']
})
export class FeedsQuestionsComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  ActiveTab: any;

  ActiveAnswerInput;
  scrollHeight;
  screenHeight: number;
  anotherHeight: number;
  UserInfo;
  PostsList: any;
  PostsListLoading: Boolean = true;
  AnswerListLoadingIndex: Number = -1;
  AnswersViewLess: Boolean = false;

  TopicFilter: Boolean = false;
  TopicFilterName;

  reportPostInfo;
  reportUserId;
  reportAnswerInfo;

  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService,
    private AnswerService: CommentAndAnswerService,
    private ratingService: LikeAndRatingServiceService,
    private Service: PostServiceService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private _componentConnectService: ComponentConnectServiceService,
    private _topicRoutingService: TopicRoutingServiceService,
    private DeleteService: ReportAndDeleteService,
    public snackBar: MatSnackBar,
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

    this.ActiveTab = this.ShareService.GetTopicQuestions();
    if (this.ActiveTab['TopicId'] !== '') {
      this.Service.GetTopicQuestionsList(this.UserInfo.data._id, '0', this.ActiveTab['TopicId'])
        .subscribe( datas => {
            if (datas['status'] === 'True') {
              this.TopicFilter = true;
              this.PostsList = datas['data'];
              this.TopicFilterName = this.PostsList[0].PostTopicName;
              this.PostsListLoading = false;
              this.ReloadGalleryScript();
            }else {
              console.log(datas);
            }
            this.ShareService.SetTopicQuestions('', '');
        });
    }else {
      this.Service.GetQuestionsList(this.UserInfo.data._id, '0')
      .subscribe( datas => {
          if (datas['status'] === 'True') {
            this.PostsList = datas['data'];
            this.PostsListLoading = false;
            this.ReloadGalleryScript();
          }else {
            console.log(datas);
          }
      });
    }

      this._componentConnectService.listen().subscribe(() => {
        this.ReloadGalleryScript();
      });

      this._topicRoutingService.listen().subscribe(() => {
        this.PostsList = [];
        this.PostsListLoading = true;
        this.Service.GetTopicQuestionsList(this.UserInfo.data._id, '0', this.ActiveTab['TopicId'])
        .subscribe( datas => {
          this.TopicFilter = true;
            if (datas['status'] === 'True') {
              this.PostsList = datas['data'];
              this.TopicFilterName = this.PostsList[0].PostTopicName;
              this.PostsListLoading = false;
              this.ReloadGalleryScript();
            }else {
              console.log(datas);
            }
            this.ShareService.SetTopicQuestions('', '');
        });
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

  ViewAllQuestions() {
    this.PostsList = [];
    this.TopicFilter = false;
    this.PostsListLoading = true;
    this.Service.GetQuestionsList(this.UserInfo.data._id, '0')
      .subscribe( datas => {
          if (datas['status'] === 'True') {
            this.PostsList = datas['data'];
            this.PostsListLoading = false;
            this.ReloadGalleryScript();
          }else {
            console.log(datas);
          }
      });
  }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 175;
    this.scrollHeight = this.screenHeight + 'px';

  }

  OpenModelQuestion() {
    const PostTwoDialogRef = this.dialog.open(PostTwoComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Questions Post Two Form', type: 'Create Form' } });
    PostTwoDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result) {
    console.log(result);
    if (result === 'Close') {
      console.log('Post Not Submit Properly');
    }else {
      this.PostsList.splice(0 , 0, result);
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
    const data = {'UserId': this.UserInfo.data._id,
          'PostId': this.PostsList[index]._id,
          'AnswerId': this.PostsList[index].Answers[AnsIndex]._id,
          'AnswerUserId':  this.PostsList[index].Answers[AnsIndex].UserId,
          'Rating': this.PostsList[index].Answers[AnsIndex].RatingCount,
          'Date':  new Date(),
        };
    this.ratingService.AnswerRatingAdd(data).subscribe( datas => {
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
    const data = {'UserId': this.UserInfo.data._id,
      'PostId': this.PostsList[index]._id,
      'PostUserId':  this.PostsList[index].UserId,
      'Rating': this.PostsList[index].RatingCount,
      'Date':  new Date(),
    };
    this.ratingService.QuestionsRatingAdd(data).subscribe( datas => {
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
      this.AnswerService.GetQuestionsAllAnswers(PostId, this.UserInfo.data._id).subscribe( datas => {
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
    const data = {'UserId': this.UserInfo.data._id,
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


  FollowUser(UserId, postIndex, answerIndex) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : UserId };
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
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }

  GotoTopic(Id) {
    this.ShareService.SetTopicQuestions(Id);
    this._topicRoutingService.TopicRouting();
  }





  TriggerPostInfo(index) {
    this.reportPostInfo = this.PostsList[index];
    this.reportUserId = this.reportPostInfo.UserId;
  }

  TriggerAnswerInfo(i, k) {
    this.reportPostInfo = this.PostsList[i];
    this.reportAnswerInfo = this.PostsList[i].Answers[k];
    this.reportUserId = this.reportAnswerInfo.UserId;
  }

  ReportUser() {
    const ReportUser = {'UserId': this.UserInfo.data._id,
                        'ReportUserId':  this.reportUserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportUserComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { type: 'User', values: ReportUser  } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportPost() {
    const ReportPost = {'UserId': this.UserInfo.data._id,
                        'PostType': 'Question',
                        'PostId':  this.reportPostInfo._id,
                        'PostUserId':  this.reportPostInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { type: 'Post', values: ReportPost } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportAnswer() {
    const ReportComment = { 'UserId': this.UserInfo.data._id,
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



  DeletePost() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', data: { text: 'Are You Sure You Want To Permanently Delete This Post?'  } });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {
          const DeletePostdata =  { 'UserId' : this.UserInfo.data._id, 'PostId' : this.reportPostInfo._id };
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
          const DeletePostdata =  { 'UserId' : this.UserInfo.data._id, 'AnswerId' : this.reportAnswerInfo._id };
          this.DeleteService.DeleteAnswer(DeletePostdata)
            .subscribe( datas => {
              if (datas.status === 'True') {
                const Postindex = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
                const index = this.reportPostInfo.Answers.findIndex(x => x._id === this.reportAnswerInfo._id);
                this.PostsList[Postindex].Answers.splice(index , 1);
                this.PostsList[Postindex].AnswersCount = this.PostsList[Postindex].AnswersCount - 1;
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



  EditPost() {
    const EditPostDialogRef = this.dialog.open( EditPostTwoComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'}, data: { data: this.reportPostInfo } });
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
      {disableClose: true, minWidth: '50%', position: {top: '50px'}, data: { data: this.reportAnswerInfo } });
      EditCommentDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const Postindex = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
          const index = this.reportPostInfo.Answers.findIndex(x => x._id === result._id);
          this.PostsList[Postindex].Answers[index].AnswerText = result.AnswerText;
        }
      });
  }
}
