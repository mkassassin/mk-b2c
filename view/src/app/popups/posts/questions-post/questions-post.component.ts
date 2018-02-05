import { Component, Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

import { PostServiceService } from "./../../../service/post-service/post-service.service";
import { LikeAndRatingServiceService } from "./../../../service/like-and-rating-service.service";
import { CommentAndAnswerService } from "./../../../service/comment-and-answer-service/comment-and-answer.service";


@Component({
  selector: 'app-questions-post',
  templateUrl: './questions-post.component.html',
  styleUrls: ['./questions-post.component.css']
})
export class QuestionsPostComponent implements OnInit {

  
  ActiveAnswerInput;
  UserInfo;
  PostsList:any;
  PostsListLoading:boolean = true;
  constructor(
    private AnswerService: CommentAndAnswerService,
    private ratingService: LikeAndRatingServiceService,
    private Service: PostServiceService,
    private dialogRef: MatDialogRef<QuestionsPostComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any  ) { 

          this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

          this.Service.ViewQuestionsPost( this.UserInfo.data._id, this.data.PostId)
          .subscribe( datas => {  
              if(datas['status'] == "True"){
                this.PostsList = datas['data'];
                this.PostsListLoading = false;
              }else{
                console.log(datas);
              }
            });
   }

  ngOnInit() {
  }

  
  RatingImage(isActive: boolean) {
    return `assets/images/icons/like${isActive ? 'd' : ''}.png`;
  }



  ChangeActiveAnswerInput(index:string){
    if(this.ActiveAnswerInput == index ){
      this.ActiveAnswerInput = -1;
    }else{
      this.ActiveAnswerInput = index;
    }
  }


  rateChanging(index){
    let data = {'UserId': this.UserInfo.data._id, 
      'PostId': this.PostsList[index]._id,
      'PostUserId':  this.PostsList[index].UserId,
      'Rating': this.PostsList[index].RatingCount,
      'Date':  new Date(),
    }
    this.ratingService.QuestionsRatingAdd(data).subscribe( datas => {
      if(datas['status'] == "True" && !datas['message']){ 
              if(datas['status'] == "True"){
                this.PostsList[index].userRated = true;
                this.PostsList[index].userRating = datas['data'].Rating;
                this.PostsList[index].RatingCount = datas['data'].OverallRating;
              }else{
                console.log(datas);
              }
      }else{
          console.log(datas);
      }
    });

  }


  
  SubmitAnswer(answer, index){

    let data = {'UserId': this.UserInfo.data._id, 
              'PostId': this.PostsList[index]._id,
              'PostUserId':  this.PostsList[index].UserId,
              'AnswerText': answer,
              'Date':  new Date(),
            }

          this.AnswerService.QuestionsAnwerAdd(data).subscribe( datas => {
            if(datas['status'] == "True" && !datas['message']){ 
                    if(datas['status'] == "True"){
                      var AnsData = new Array();
                      AnsData = datas['data'];
                      this.PostsList[index].Answers.splice(0, 0, AnsData);
                      this.PostsList[index].AnswersCount = this.PostsList[index].AnswersCount + 1;
                    }else{
                      console.log(datas);
                    }
            }else{
                console.log(datas);
            }
          });
  }


  

  close() {
    this.dialogRef.close('Close');
  }

}
