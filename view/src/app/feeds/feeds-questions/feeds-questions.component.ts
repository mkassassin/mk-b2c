import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { PostTwoComponent } from './../../popups/post-two/post-two.component';
import { PostServiceService } from './../../service/post-service/post-service.service';
import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';
import { LikeAndRatingServiceService } from './../../service/like-and-rating-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';

@Component({
  selector: 'app-feeds-questions',
  templateUrl: './feeds-questions.component.html',
  styleUrls: ['./feeds-questions.component.css']
})
export class FeedsQuestionsComponent implements OnInit {

  ActiveAnswerInput;
  scrollHeight;
  screenHeight: number;
  anotherHeight: number;
  UserInfo;
  PostsList: any;
  PostsListLoading: Boolean = true;

  constructor(private router: Router,
    private ShareService: DataSharedVarServiceService,
    private AnswerService: CommentAndAnswerService,
    private ratingService: LikeAndRatingServiceService,
    private Service: PostServiceService,
    public dialog: MatDialog,
    private elementRef: ElementRef
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

    this.Service.GetQuestionsList(this.UserInfo.data._id, '0')
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
    this.screenHeight = window.innerHeight - 165;
    this.scrollHeight = this.screenHeight + 'px';

  }

  OpenModelQuestion() {
    const PostTwoDialogRef = this.dialog.open(PostTwoComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Questions Post Two Form', type: 'Creat Form' } });
    PostTwoDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result) {
    console.log(result);
    if (result === 'Close') {
      console.log('Post Not Submit Properly');
    }else {
      this.PostsList.splice(0 , 0, result);
      const s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = './../../../assets/html5gallery/html5gallery.js';
          this.elementRef.nativeElement.appendChild(s);
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






  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['Profile']);
  }


}
