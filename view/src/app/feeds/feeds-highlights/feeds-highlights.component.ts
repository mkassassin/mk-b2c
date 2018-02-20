import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { PostOneComponent } from './../../popups/post-one/post-one.component';
import { PostServiceService } from './../../service/post-service/post-service.service';
import { LikeAndRatingServiceService } from './../../service/like-and-rating-service.service';
import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { ComponentConnectServiceService } from './../../service/component-connect-service.service';
import { ReportUserComponent } from './../../popups/report-user/report-user.component';
import { ReportPostComponent } from './../../popups/report-post/report-post.component';
import { DeleteConfirmComponent } from './../../popups/delete-confirm/delete-confirm.component';
import { ReportAndDeleteService } from './../../service/report-and-delete-service/report-and-delete.service';
import { EditPostOneComponent } from './../../popups/edit-post-one/edit-post-one.component';
import { EditCommentComponent } from './../../popups/edit-comment/edit-comment.component';

@Component({
  selector: 'app-feeds-highlights',
  templateUrl: './feeds-highlights.component.html',
  styleUrls: ['./feeds-highlights.component.css']
})
export class FeedsHighlightsComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  scrollHeight;
  screenHeight: number;
  anotherHeight: number;
  UserInfo;
  PostsList: any;
  TimeOut: Boolean = true;
  ActiveComment;
  LoadingActiveComment;
  PostsListLoder: Boolean = true;

  reportPostInfo;
  reportUserId;
  reportCommentInfo;

  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService,
    private Service: PostServiceService,
    private LikeService: LikeAndRatingServiceService,
    private commentservice: CommentAndAnswerService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private _componentConnectService: ComponentConnectServiceService,
    private DeleteService: ReportAndDeleteService,
    public snackBar: MatSnackBar,
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

                    this.Service.GetHighlightsList(this.UserInfo.data._id, '0')
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
                          this.PostsListLoder = false;
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
    this.screenHeight = window.innerHeight - 175;
    this.scrollHeight = this.screenHeight + 'px';
  }

  OpenModel() {
    const PostOneDialogRef = this.dialog.open( PostOneComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Highlight Post One Form', type: 'Create Form' } });
    PostOneDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result) {
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


  AddLike(index) {
    const data = {'UserId': this.UserInfo.data._id,
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
      this.commentservice.GetHighlightsComments(this.PostsList[index]._id, this.UserInfo.data._id)
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
    const data = {'UserId': this.UserInfo.data._id,
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
                this.commentservice.GetHighlightsComments(this.PostsList[index]._id, this.UserInfo.data._id)
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



  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }


  FollowUser(UserId, postIndex, commentIndex) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : UserId };
      this.FollowService.FollowUser(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.PostsList[postIndex].comments[commentIndex]['AlreadyFollow'] = true;
          }else {
            console.log(datas);
          }
      });
  }












  TriggerPostInfo(index) {
    this.reportPostInfo = this.PostsList[index];
    this.reportUserId = this.reportPostInfo.UserId;
  }

  TriggercommentInfo(index) {
    this.reportCommentInfo = this.PostsList[this.ActiveComment].comments[index];
    this.reportUserId = this.reportCommentInfo.UserId;
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
                        'PostType': 'Highlights',
                        'PostId':  this.reportPostInfo._id,
                        'PostUserId':  this.reportPostInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { type: 'Post', values: ReportPost } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportComment() {
    const ReportComment = { 'UserId': this.UserInfo.data._id,
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


  DeletePost() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', data: { text: 'Are You Sure You Want To Permanently Delete This Post?'  } });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {
          const DeletePostdata =  { 'UserId' : this.UserInfo.data._id, 'PostId' : this.reportPostInfo._id };
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
          const DeletePostdata =  { 'UserId' : this.UserInfo.data._id, 'CommentId' : this.reportCommentInfo._id };
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





  EditPost() {
    const EditPostDialogRef = this.dialog.open( EditPostOneComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'}, data: { data: this.reportPostInfo } });
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
      {disableClose: true, minWidth: '50%', position: {top: '50px'}, data: { data: this.reportCommentInfo } });
      EditCommentDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const index = this.PostsList[this.ActiveComment].comments.findIndex(x => x._id === result._id);
          this.PostsList[this.ActiveComment].comments[index].CommentText = result.CommentText;
        }
      });
  }

}
