import { Component, Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

import { PostServiceService } from "./../../../service/post-service/post-service.service";
import { LikeAndRatingServiceService } from "./../../../service/like-and-rating-service.service";
import { CommentAndAnswerService } from "./../../../service/comment-and-answer-service/comment-and-answer.service";


@Component({
  selector: 'app-highlights-post',
  templateUrl: './highlights-post.component.html',
  styleUrls: ['./highlights-post.component.css']
})
export class HighlightsPostComponent implements OnInit {

  scrollHeight;
  screenHeight:number;
  anotherHeight:number;
  UserInfo;
  PostsList:any;
  TimeOut:boolean = true;
  ActiveComment;
  LoadingActiveComment;
  PostsListLoder:boolean = true;

  constructor(
    private Service: PostServiceService,
    private LikeService: LikeAndRatingServiceService,
    private commentservice :CommentAndAnswerService,
    private dialogRef: MatDialogRef<HighlightsPostComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any ) {

      this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

      this.Service.ViewHighlightPost(this.UserInfo.data._id, this.data.PostId )
                    .subscribe( datas => { 
                        if(datas['status'] == "True"){
                          this.PostsList = datas['data'];
                          this.PostsListLoder = false;
                        }else{
                          console.log(datas);
                        }
                      });
     }

  ngOnInit() {
  }

  AddLike(index){
    let data = {'UserId': this.UserInfo.data._id, 
                'PostId': this.PostsList[index]._id,
                'PostUserId':  this.PostsList[index].UserId,
                'Date':  new Date(),
              }
    this.LikeService.HighlightsLikeAdd(data).subscribe( datas => {  
          if(datas['status'] == "True" && !datas['message']){
            console.log(datas['data']._id);
            this.PostsList[index].UserLiked = true;
            this.PostsList[index].UserLikeId = datas['data']._id;
            this.PostsList[index].LikesCount = this.PostsList[index].LikesCount + 1;
          }else{
            console.log(datas);
          }
        });
  }


  RemoveLike(index){
    this.LikeService.HighlightsUnLike(this.PostsList[index].UserLikeId).subscribe( datas => {  
          if(datas['status'] == "True" && !datas['message']){
            this.PostsList[index].UserLiked = false;
            this.PostsList[index].LikesCount = this.PostsList[index].LikesCount - 1;
          }else{
            console.log(datas);
          }
      });
  }


  ChangeActiveComment(index:string){
    if(this.ActiveComment == index || this.LoadingActiveComment == index){
      this.ActiveComment = -1;
      this.LoadingActiveComment = -1;
    }else{
      this.ActiveComment = index;
      this.LoadingActiveComment = index;
      this.PostsList[index].comments = [];
      this.commentservice.GetHighlightsComments(this.PostsList[index]._id)
      .subscribe( newDatas => {
        this.LoadingActiveComment = -1;
        if(newDatas['status'] == "True"){
          console.log(newDatas['data']);
          this.PostsList[index].comments = newDatas['data'];
        }else{
          console.log(newDatas);
        }
      });
    }
  }


  SubmitComment(comment, index){
    let data = {'UserId': this.UserInfo.data._id, 
              'PostId': this.PostsList[index]._id,
              'PostUserId':  this.PostsList[index].UserId,
              'CommentText': comment,
              'Date':  new Date(),
            }
            this.LoadingActiveComment = index;
            this.ActiveComment = index;
            this.PostsList[index].comments = [];
          this.commentservice.HighlightsCommentAdd(data).subscribe( datas => {  
            if(datas['status'] == "True" && !datas['message']){ 

                this.commentservice.GetHighlightsComments(this.PostsList[index]._id)
                  .subscribe( newDatas => 
                  {
                    this.LoadingActiveComment = -1;
                    if(newDatas['status'] == "True"){
                      this.PostsList[index].comments = newDatas['data'];
                      this.PostsList[index].commentsCount = this.PostsList[index].commentsCount + 1;
                    }else{
                      console.log(newDatas);
                    }
                  });
                
            }else{
                console.log(datas);
            }
          });
  }


  close() {
    this.dialogRef.close('Close');
  }

}
