import { Component, Directive, Inject, OnInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { Router } from '@angular/router';

import { FollowServiceService } from './../../../service/follow-service/follow-service.service';
import { PostTwoComponent } from './../../../popups/post-two/post-two.component';
import { PostServiceService } from './../../../service/post-service/post-service.service';
import { CommentAndAnswerService } from './../../../service/comment-and-answer-service/comment-and-answer.service';
import { LikeAndRatingServiceService } from './../../../service/like-and-rating-service.service';
import { DataSharedVarServiceService } from './../../../service/data-shared-var-service/data-shared-var-service.service';


@Component({
  selector: 'app-questions-post',
  templateUrl: './questions-post.component.html',
  styleUrls: ['./questions-post.component.css']
})
export class QuestionsPostComponent implements OnInit {


  ActiveAnswerInput;
  scrollHeight;
  screenHeight: number;
  anotherHeight: number;
  UserInfo;
  PostsList: any;
  PostsListLoading: Boolean = true;

  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService,
    private AnswerService: CommentAndAnswerService,
    private ratingService: LikeAndRatingServiceService,
    private Service: PostServiceService,
    private elementRef: ElementRef,
    private dialogRef: MatDialogRef<QuestionsPostComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any  ) {

          this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

          this.Service.ViewQuestionsPost( this.UserInfo.data._id, this.data.PostId)
          .subscribe( datas => {
              if (datas['status'] === 'True') {
                this.PostsList = datas['data'];
                this.PostsListLoading = false;

                const s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = './../../../assets/html5gallery/html5gallery.js';
                this.elementRef.nativeElement.appendChild(s);

              }else {
                console.log(datas);
              }
            });
   }

  ngOnInit() {
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





  SubmitAnswer(answer, index) {
    if (answer !== '') {
    const data = {'UserId': this.UserInfo.data._id,
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





  close() {
    this.dialogRef.close('Close');
  }

}
