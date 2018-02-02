import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


import { PostOneComponent } from './../../popups/post-one/post-one.component';
import { PostServiceService } from "./../../service/post-service/post-service.service";
import { LikeAndRatingServiceService } from "./../../service/like-and-rating-service.service";
import { CommentAndAnswerService } from "./../../service/comment-and-answer-service/comment-and-answer.service";

@Component({
  selector: 'app-feeds-highlights',
  templateUrl: './feeds-highlights.component.html',
  styleUrls: ['./feeds-highlights.component.css']
})
export class FeedsHighlightsComponent implements OnInit {
  clicked:boolean = false;
  clicked2:boolean =false;
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
    public dialog: MatDialog
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

                    this.Service.GetHighlightsList(this.UserInfo.data._id, '0')
                    .subscribe( datas => {  
                        if(datas['status'] == "True"){
                          this.PostsList = datas['data'];
                          this.PostsListLoder = false;
                        }else{
                          console.log(datas);
                        }
                      });
   }

  // material dialog 
  PostOneDialogRef: MatDialogRef<PostOneComponent>;

  ngOnInit() {
    this.screenHeight = window.innerHeight - 165;
    this.scrollHeight = this.screenHeight + "px";
  }

  OpenModel() {
    let PostOneDialogRef = this.dialog.open(PostOneComponent, {disableClose:true, minWidth:'50%', position: {top: '50px'},  data: { Header:'Highlight Post One Form', type:'Creat Form' } });
    PostOneDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result){
    console.log(result);
    if(result === "Close"){
      console.log('Post Not Submit Properly');
    }else{
      this.PostsList.splice(0 , 0, result);
    }
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
  
}
