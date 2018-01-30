import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


import { PostOneComponent } from './../../popups/post-one/post-one.component';
import { PostServiceService } from "./../../service/post-service/post-service.service";

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

  constructor(
    private Service: PostServiceService,
    public dialog: MatDialog
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

                    this.Service.GetPostList(this.UserInfo.data._id, '0')
                    .subscribe( datas => {  
                        if(datas['status'] == "True"){
                          this.PostsList = datas['data'];
                          console.log(datas);
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
    let PostOneDialogRef = this.dialog.open(PostOneComponent, { minWidth:'50%', position: {top: '50px'},  data: { Header:'Highlight Post One Form', type:'Creat Form' } });
    PostOneDialogRef.afterClosed().subscribe(result => this.postSubmit(result));
  }

  postSubmit(result){
    if(result === "Close"){
      alert('Post Not Submit Properly;');
    }else{

    }
  }
}
