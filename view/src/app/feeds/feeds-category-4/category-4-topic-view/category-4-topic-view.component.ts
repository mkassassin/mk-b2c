import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Category4CreateTopicComponent } from './../../../popups/category-4-create-topic/category-4-create-topic.component';
import { Category4TopicPostComponent } from './../../../popups/category-4-topic-post/category-4-topic-post.component';
import { Category4ServiceService } from './../../../service/category-4-service/category-4-service.service';


import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';

import { FollowServiceService } from './../../../service/follow-service/follow-service.service';
import { PostServiceService } from './../../../service/post-service/post-service.service';
import { PostOneComponent } from './../../../popups/post-one/post-one.component';
import { LikeAndRatingServiceService } from './../../../service/like-and-rating-service.service';
import { CommentAndAnswerService } from './../../../service/comment-and-answer-service/comment-and-answer.service';
import { DataSharedVarServiceService } from './../../../service/data-shared-var-service/data-shared-var-service.service';
import { ComponentConnectServiceService } from './../../../service/component-connect-service.service';
import { ReportUserComponent } from './../../../popups/report-user/report-user.component';
import { ReportPostComponent } from './../../../popups/report-post/report-post.component';
import { DeleteConfirmComponent } from './../../../popups/delete-confirm/delete-confirm.component';
import { ReportAndDeleteService } from './../../../service/report-and-delete-service/report-and-delete.service';
import { EditCategory4TopicPostComponent } from './../../../popups/edit-category-4-topic-post/edit-category-4-topic-post.component';
import { EditCategory4TopicCommentComponent
  } from './../../../popups/edit-category-4-topic-comment/edit-category-4-topic-comment.component';

@Component({
  selector: 'app-category-4-topic-view',
  templateUrl: './category-4-topic-view.component.html',
  styleUrls: ['./category-4-topic-view.component.css']
})
export class Category4TopicViewComponent implements OnInit {

  @ViewChild('mainScreen') elementView: ElementRef;
  viewHeight: number;

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';
  DocumentsBaseUrl: String = 'http://localhost:3000/static/documents';
  Category4TopicImageBaseUrl: String = 'http://localhost:3000/static/category-4-topics';

  @Input() TopicInfo: any;
  @Output() gotoTopicList = new EventEmitter();
  ActiveTopicCategory = 'Snippet';


  scrollHeight;
  screenHeight: number;
  anotherHeight: number;
  UserInfo;
  PostsList: any;
  ActiveComment;
  LoadingActiveComment;
  PostsListLoder: Boolean = true;
  MorePostsListLoder: Boolean = false;
  SkipCount = 0 ;
  ScrollToDiv;

  noMorePosts: Boolean = false;

  reportPostInfo;
  reportUserId;
  reportCommentInfo;

  CommentViewLess: Boolean = false;


  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService,
    private Service: Category4ServiceService,
    private PostService: PostServiceService,
    private LikeService: LikeAndRatingServiceService,
    private commentservice: CommentAndAnswerService,
    private elementRef: ElementRef,
    private _componentConnectService: ComponentConnectServiceService,
    private DeleteService: ReportAndDeleteService,
    private fb: FacebookService
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

    const initParams: InitParams = {
      appId: '202967426952150',
      xfbml: true,
      version: 'v2.11'
    };
    fb.init(initParams);
        this._componentConnectService.listen().subscribe(() => {
            this.ReloadGalleryScript();
        });
   }


  //  share() {
  //   let SharePostImage = 'http://www.b2c.network/assets/images/icons/logo.png';
  //   if ( this.reportPostInfo.PostImage[0] !== '' ) {
  //     SharePostImage = 'http://139.59.20.129:3000/static/images/' + this.reportPostInfo.PostImage[0].ImageName;
  //   }
  //   const SharePostText = this.reportPostInfo.PostText;
  //   let SharePostTitle = this.reportPostInfo.PostText;
  //   if (SharePostText.length > 70 ) {
  //     SharePostTitle = this.reportPostInfo.PostText.substring(0, 70) + '...';
  //   }
  //   const ShareUrl = 'http://www.b2c.network/SharedPost/' + this.reportPostInfo._id + '/t_1';
  //   const params: UIParams = {
  //     method: 'share_open_graph',
  //     action_type: 'og.shares',
  //     action_properties: JSON.stringify({
  //         object: {
  //             'og:url': ShareUrl,
  //             'og:title': SharePostTitle,
  //             'og:description': SharePostText,
  //             'og:image': SharePostImage,
  //         }
  //       })
  //     };

  //   this.fb.ui(params)
  //     .then((res: UIResponse) => {
  //       if ( res['error_code'] !== '' && res['error_code']  ) {
  //         console.log(res);
  //       }else {
  //           const SharePost = { 'UserId': this.UserInfo.data._id,
  //                               'PostUserId': this.reportPostInfo.UserId,
  //                               'PostId':  this.reportPostInfo._id,
  //                             };
  //           this.Service.HighlightsFBPostShare(SharePost).subscribe(datas => {
  //             if (datas['status'] === 'True') {
  //               const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
  //               this.PostsList[index].UserShared = true;
  //               this.PostsList[index].ShareCount = this.PostsList[index].ShareCount + 1;
  //               this.snackBar.open( ' Post Successfully Shared in Facebook', ' ', {
  //                 horizontalPosition: 'center',
  //                 duration: 3000,
  //                 verticalPosition: 'top',
  //               });
  //             }else {
  //               console.log(datas);
  //             }
  //           });
  //       }
  //     })
  //     .catch((e: any) => {
  //       this.snackBar.open( 'Facebook Post Share Failed', ' ', {
  //         horizontalPosition: 'center',
  //         duration: 3000,
  //         verticalPosition: 'top',
  //       });
  //       console.log(e);
  //     });
  // }


  shareInternal() {
    const SharePost = {'UserId': this.UserInfo.data._id,
                        'ShareUserName': this.reportPostInfo.UserName,
                        'PostId':  this.reportPostInfo._id,
                        'PostFrom': 'Categor4TopicPost',
                        'PostDate':  new Date()
                      };
    this.PostService.Category4TopicPostHighlightsShare(SharePost).subscribe(datas => {
      if (datas.status === 'True') {
        this.snackBar.open( ' Post Successfully Shared in B2C Highlights', ' ', {
          horizontalPosition: 'center',
          duration: 3000,
          verticalPosition: 'top',
        });
        const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
        this.PostsList[index].UserShared = true;
        this.PostsList[index].ShareCount = this.PostsList[index].ShareCount + 1;
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


  RatingImage(isActive: boolean) {
    return `assets/images/icons/like${isActive ? 'd' : ''}.png`;
  }

  rateChanging(index) {
    const data = {'UserId': this.UserInfo.data._id,
      'PostId': this.PostsList[index]._id,
      'PostUserId':  this.PostsList[index].UserId,
      'Rating': this.PostsList[index].userRating,
      'Date':  new Date(),
    };
    this.LikeService.Category4TopicPostRatingAdd(data).subscribe( datas => {
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


  LoadMorePosts() {
    this.MorePostsListLoder = true;
    setTimeout(() => {
        document.getElementById('miniLoader').scrollIntoView();
    }, 0);
    this.Service.Category4TopicPostList(this.TopicInfo._id, this.ActiveTopicCategory, this.UserInfo.data._id, this.SkipCount)
    .subscribe( datas => {
        if (datas['status'] === 'True') {
          if (datas['data'].length < 15 ) {
            this.SkipCount = this.SkipCount + 15;
            this.ScrollToDiv = datas['data'][0]._id;
            this.PostsList = [...this.PostsList, ...datas['data']];
            const tempPostList = this.PostsList;
            this.PostsList = [];
            this.MorePostsListLoder = false;
            setTimeout(() => {
              this.PostsList = tempPostList;
              const s = document.createElement('script');
                  s.type = 'text/javascript';
                  s.src = './../../../assets/html5gallery/html5gallery.js';
                  this.elementRef.nativeElement.appendChild(s);
                  setTimeout(() => {
                    const mainDiv = document.getElementById(this.ScrollToDiv);
                    mainDiv.scrollIntoView();
                  }, 0);
            }, 0);
          }else {
            this.noMorePosts = true;
          }
        }else {
          console.log(datas);
          this.MorePostsListLoder = false;
        }
      });
  }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 370;
    this.scrollHeight = this.screenHeight + 'px';

    this.Service.Category4TopicPostList(this.TopicInfo._id, 'Snippet', this.UserInfo.data._id, this.SkipCount)
    .subscribe( datas => {
        if (datas['status'] === 'True') {
          this.SkipCount = this.SkipCount + 15;
          this.PostsList = datas['data'];
          this.PostsListLoder = false;
          if (datas['data'].length < 15 ) {
            this.noMorePosts = true;
          }
          const s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = './../../../assets/html5gallery/html5gallery.js';
          this.elementRef.nativeElement.appendChild(s);

        }else {
          console.log(datas);
          this.PostsListLoder = false;
        }
      });
  }


  ChangeActiveTopicCategory(name) {
    this.ActiveTopicCategory = name;
    this.ActiveComment = -1;
    this.PostsList = [];
    this.PostsListLoder = true;
    this.SkipCount = 0;

    this.Service.Category4TopicPostList(this.TopicInfo._id, this.ActiveTopicCategory, this.UserInfo.data._id, this.SkipCount)
    .subscribe( datas => {
        if (datas['status'] === 'True') {
          this.SkipCount = this.SkipCount + 15;
          this.PostsList = datas['data'];
          this.PostsListLoder = false;
          if (datas['data'].length < 15 ) {
            this.noMorePosts = true;
          }
          const s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = './../../../assets/html5gallery/html5gallery.js';
          this.elementRef.nativeElement.appendChild(s);

        }else {
          console.log(datas);
          this.PostsListLoder = false;
        }
      });
  }

  AddNewPost() {
    const CreatTopictPostDialogRef = this.dialog.open( Category4TopicPostComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'},  data: {type: this.ActiveTopicCategory, TopicId: this.TopicInfo._id} }
    );
    CreatTopictPostDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }


  postSubmit(result) {
    if (result === 'Close') {
      this.snackBar.open( 'Post Form Closed', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }else {
      if ( this.ActiveTopicCategory === 'Snippet') { this.TopicInfo.SnippetCount = this.TopicInfo.SnippetCount + 1; }
      if ( this.ActiveTopicCategory === 'Video') { this.TopicInfo.VideoCount = this.TopicInfo.VideoCount + 1; }
      if ( this.ActiveTopicCategory === 'Article') { this.TopicInfo.ArticleCount = this.TopicInfo.ArticleCount + 1; }
      if ( this.ActiveTopicCategory === 'Document') { this.TopicInfo.DocumentCount = this.TopicInfo.DocumentCount + 1; }

      this.SkipCount = this.SkipCount + 1;
      if ( this.PostsList.length === 0) {
        this.PostsList.push(result);
      }else {
      this.PostsList.splice(0 , 0, result);
      }
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

  AddCommentLike(index, commentIndex) {
    const data = {'UserId': this.UserInfo.data._id,
                'PostId': this.PostsList[index]._id,
                'CommentId': this.PostsList[index].comments[commentIndex]._id,
                'CommentUserId':  this.PostsList[index].comments[commentIndex].UserId,
                'Date':  new Date(),
              };
    this.LikeService.Category4TopicCommentsLikeAdd(data).subscribe( datas => {
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
    this.LikeService.Category4TopicCommentsUnLike(this.PostsList[index].comments[commentIndex].UserLikeId).subscribe( datas => {
          if (datas['status'] === 'True' && !datas['message']) {
            this.PostsList[index].comments[commentIndex].UserLiked = false;
            this.PostsList[index].comments[commentIndex].LikesCount = this.PostsList[index].comments[commentIndex].LikesCount - 1;
          }else {
            console.log(datas);
          }
      });
  }

  // AddLike(index) {
  //   const data = {'UserId': this.UserInfo.data._id,
  //               'PostId': this.PostsList[index]._id,
  //               'PostUserId':  this.PostsList[index].UserId,
  //               'Date':  new Date(),
  //             };
  //   this.LikeService.HighlightsLikeAdd(data).subscribe( datas => {
  //         if (datas['status'] === 'True' && !datas['message']) {
  //           console.log(datas['data']._id);
  //           this.PostsList[index].UserLiked = true;
  //           this.PostsList[index].UserLikeId = datas['data']._id;
  //           this.PostsList[index].LikesCount = this.PostsList[index].LikesCount + 1;
  //         }else {
  //           console.log(datas);
  //         }
  //       });
  // }


  // RemoveLike(index) {
  //   this.LikeService.HighlightsUnLike(this.PostsList[index].UserLikeId).subscribe( datas => {
  //         if (datas['status'] === 'True' && !datas['message']) {
  //           this.PostsList[index].UserLiked = false;
  //           this.PostsList[index].LikesCount = this.PostsList[index].LikesCount - 1;
  //         }else {
  //           console.log(datas);
  //         }
  //     });
  // }


  ChangeActiveComment(index: string) {
    this.CommentViewLess = false;
    if (this.ActiveComment === index || this.LoadingActiveComment === index) {
      this.ActiveComment = -1;
      this.LoadingActiveComment = -1;
    }else {
      this.ActiveComment = index;
      this.LoadingActiveComment = index;
      this.PostsList[index].comments = [];
      this.commentservice.Category4TopicCommentList(this.PostsList[index]._id, this.UserInfo.data._id)
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
      this.commentservice.Category4TopicAllCommentList(this.PostsList[index]._id, this.UserInfo.data._id)
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
    const data = {'UserId': this.UserInfo.data._id,
              'PostId': this.PostsList[index]._id,
              'PostUserId':  this.PostsList[index].UserId,
              'CommentText': comment,
              'Date':  new Date(),
            };
            this.LoadingActiveComment = index;
            this.ActiveComment = index;
            this.PostsList[index].comments = [];
          this.commentservice.Category4TopicCommentAdd(data).subscribe( datas => {
            if (datas['status'] === 'True' && !datas['message']) {
              this.PostsList[index].UserCommented = true;
                this.commentservice.Category4TopicCommentList(this.PostsList[index]._id, this.UserInfo.data._id)
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
      {disableClose: true, maxWidth: '99%', position: {top: '50px'},  data: { type: 'User', values: ReportUser  } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportPost() {
    const ReportPost = {'UserId': this.UserInfo.data._id,
                        'PostType': 'Category4TopicPost',
                        'PostId':  this.reportPostInfo._id,
                        'PostUserId':  this.reportPostInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true,  maxWidth: '99%', position: {top: '50px'},  data: { type: 'Post', values: ReportPost } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  ReportComment() {
    const ReportComment = { 'UserId': this.UserInfo.data._id,
                        'PostId':  this.reportCommentInfo.PostId,
                        'SecondLevelPostType': 'Category4TopicPostComment',
                        'SecondLevelPostId':  this.reportCommentInfo._id,
                        'SecondLevelPostUserId': this.reportCommentInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true,  maxWidth: '99%', position: {top: '50px'},
      data: { exactType: 'Comment', type: 'SecondLevelPost', values: ReportComment } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }


  DeletePost() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', data: { text: 'Are You Sure You Want To Permanently Delete This Post?'  } });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {

          if ( this.ActiveTopicCategory === 'Snippet') { this.TopicInfo.SnippetCount = this.TopicInfo.SnippetCount - 1; }
          if ( this.ActiveTopicCategory === 'Video') { this.TopicInfo.VideoCount = this.TopicInfo.VideoCount - 1; }
          if ( this.ActiveTopicCategory === 'Article') { this.TopicInfo.ArticleCount = this.TopicInfo.ArticleCount - 1; }
          if ( this.ActiveTopicCategory === 'Document') { this.TopicInfo.DocumentCount = this.TopicInfo.DocumentCount - 1; }

          const DeletePostdata =  { 'UserId' : this.UserInfo.data._id, 'PostId' : this.reportPostInfo._id };
          this.DeleteService.DeleteCategory4TopicPost(DeletePostdata)
            .subscribe( datas => {
              if (datas.status === 'True') {
                this.SkipCount = this.SkipCount - 1;
                const index = this.PostsList.findIndex(x => x._id === this.reportPostInfo._id);
                this.PostsList.splice(index , 1);
                this.snackBar.open( 'Your Post Deleted Successfully', ' ', {
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
          this.DeleteService.DeleteCategory4TopicComment(DeletePostdata)
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
    const EditPostDialogRef = this.dialog.open( EditCategory4TopicPostComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'}, data: { data: this.reportPostInfo, type: this.ActiveTopicCategory } });
      EditPostDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const index = this.PostsList.findIndex(x => x._id === result._id);
          this.PostsList[index].PostType = result.PostType;
          this.PostsList[index].PostDate = result.PostDate;
          this.PostsList[index].PostText = result.PostText;
          this.PostsList[index].PostLink = result.PostLink;
          this.PostsList[index].PostImage = result.PostImage;
          this.PostsList[index].PostDocument = result.PostDocument;
          this.PostsList[index].PostVideo = result.PostVideo;
          this.PostsList[index].PostLinkInfo = result.PostLinkInfo;
          this.ReloadGalleryScript();
          this.snackBar.open( ' Post Succesfully Updated', ' ', {
            horizontalPosition: 'center',
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      });
  }

  EditComment() {
    const EditCommentDialogRef = this.dialog.open( EditCategory4TopicCommentComponent,
      {disableClose: true, maxWidth: '99%', position: {top: '50px'}, data: { data: this.reportCommentInfo } });
      EditCommentDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const index = this.PostsList[this.ActiveComment].comments.findIndex(x => x._id === result._id);
          this.PostsList[this.ActiveComment].comments[index].CommentText = result.CommentText;
        }
      });
  }









  goBack() {
    this.gotoTopicList.next();
  }

  OpenModelCreatTopic() {
    const CreatTopictDialogRef = this.dialog.open(
      Category4CreateTopicComponent, {disableClose: true, maxWidth: '99%', position: {top: '50px'},  data: { PostId: '' } }
    );
    CreatTopictDialogRef.afterClosed().subscribe(result => this.Close(result));
  }

  Close(result) {
    if (result['result'] === 'Success') {
      this.snackBar.open( 'Your New Discover Topic Successfully Created', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
      this.gotoTopicList.next();
    }else {
      this.snackBar.open( 'Discover Topic Creat Form Closed', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }
  }


}
