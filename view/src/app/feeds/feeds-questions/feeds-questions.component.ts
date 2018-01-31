import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { PostTwoComponent } from './../../popups/post-two/post-two.component';
import { PostServiceService } from "./../../service/post-service/post-service.service";

@Component({
  selector: 'app-feeds-questions',
  templateUrl: './feeds-questions.component.html',
  styleUrls: ['./feeds-questions.component.css']
})
export class FeedsQuestionsComponent implements OnInit {
  clicked:boolean = false;
  clicked2:boolean =false;
  scrollHeight;
  screenHeight:number;
  anotherHeight:number;
  UserInfo;
  PostsList:any;
  TimeOut:boolean = true;

  constructor(
    private Service: PostServiceService,
    public dialog: MatDialog
  ) { 
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

    this.Service.GetQuestionsList(this.UserInfo.data._id, '0')
    .subscribe( datas => {  
        if(datas['status'] == "True"){
          this.PostsList = datas['data']
        }else{
          console.log(datas);
        }
      });
      this.TimeOutFuction();
  }

  TimeOutFuction(){
    setTimeout(()=>{ this.TimeOut = false; },8000);
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

}
