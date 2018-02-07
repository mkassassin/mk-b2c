import { Component, OnInit } from '@angular/core';


import { ProfileSerivceService } from './../../service/profile-service/profile-serivce.service';
import { LikeAndRatingServiceService } from './../../service/like-and-rating-service.service';
import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.css']
})
export class ProfileTimelineComponent implements OnInit {
  clicked: Boolean = false;
  clicked2: Boolean = false;
  scrollHeight;
  screenHeight: number;
  anotherHeight: number;

  UserInfo;
  PostsList: any;
  ActiveComment;
  LoadingActiveComment;
  ActiveAnswerInput;
  PostsListLoder: Boolean = true;


  constructor(
    private Service: ProfileSerivceService,
    private LikeService: LikeAndRatingServiceService,
    private commentservice: CommentAndAnswerService,
    private AnswerService: CommentAndAnswerService,
      ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.Service.Timeline(this.UserInfo.data._id)
        .subscribe( datas => {
            if (datas['status'] === 'True') {
              this.PostsList = datas['data'];
              this.PostsListLoder = false;
            }else {
              console.log(datas);
            }
          });

       }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 100;
    this.scrollHeight = this.screenHeight + 'px';
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
      this.commentservice.GetHighlightsComments(this.PostsList[index]._id)
      .subscribe( newDatas => {
        this.LoadingActiveComment = -1;
        if (newDatas['status'] === 'True') {
          console.log(newDatas['data']);
          this.PostsList[index].comments = newDatas['data'];
        }else {
          console.log(newDatas);
        }
      });
    }
  }


  SubmitComment(comment, index) {
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

                this.commentservice.GetHighlightsComments(this.PostsList[index]._id)
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




  ChangeActiveAnswerInput(index: string) {
    if (this.ActiveAnswerInput === index ) {
      this.ActiveAnswerInput = -1;
    }else {
      this.ActiveAnswerInput = index;
    }
  }





  SubmitAnswer(answer, index) {
    const data = {'UserId': this.UserInfo.data._id,
              'PostId': this.PostsList[index]._id,
              'PostUserId':  this.PostsList[index].UserId,
              'AnswerText': answer,
              'Date':  new Date(),
            };

            console.log(data);
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
