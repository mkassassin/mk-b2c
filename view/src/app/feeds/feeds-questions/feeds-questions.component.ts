import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { PostTwoComponent } from './../../popups/post-two/post-two.component';
import { PostServiceService } from "./../../service/post-service/post-service.service";
import { CommentAndAnswerService } from "./../../service/comment-and-answer-service/comment-and-answer.service";

@Component({
  selector: 'app-feeds-questions',
  templateUrl: './feeds-questions.component.html',
  styleUrls: ['./feeds-questions.component.css']
})
export class FeedsQuestionsComponent implements OnInit {

  ActiveAnswerInput;
  scrollHeight;
  screenHeight:number;
  anotherHeight:number;
  UserInfo;
  PostsList:any;
  PostsListLoading:boolean = true;

  constructor(
    private AnswerService: CommentAndAnswerService,
    private Service: PostServiceService,
    public dialog: MatDialog
  ) { 
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

    this.Service.GetQuestionsList(this.UserInfo.data._id, '0')
    .subscribe( datas => {  
        if(datas['status'] == "True"){
          this.PostsList = datas['data'];
          this.PostsListLoading = false;
        }else{
          console.log(datas);
        }
      });
  }


  // material dialog 
  PostTwoDialogRef: MatDialogRef<PostTwoComponent>;

  ngOnInit() {
    this.screenHeight = window.innerHeight - 165;
    this.scrollHeight = this.screenHeight + "px";
  }

  OpenModelQuestion() {
    let PostTwoDialogRef = this.dialog.open(PostTwoComponent, {disableClose:true, minWidth:'50%', position: {top: '50px'},  data: { Header:'Questions Post Two Form', type:'Creat Form' } });
    PostTwoDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result){
    console.log(result);
    if(result === "Close"){
      console.log('Post Not Submit Properly');
    }else{
      this.PostsList.splice(0 , 0, result);
    }
  }


  ChangeActiveAnswerInput(index:string){
    if(this.ActiveAnswerInput == index ){
      this.ActiveAnswerInput = -1;
    }else{
      this.ActiveAnswerInput = index;
    }
  }





  SubmitAnswer(answer, index){

    let data = {'UserId': this.UserInfo.data._id, 
              'PostId': this.PostsList[index]._id,
              'PostUserId':  this.PostsList[index].UserId,
              'AnswerText': answer,
              'Date':  new Date(),
            }

            console.log(data);
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




}
