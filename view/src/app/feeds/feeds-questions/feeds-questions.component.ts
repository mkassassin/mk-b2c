import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { PostTwoComponent } from './../../popups/post-two/post-two.component';

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

  constructor(
    public dialog: MatDialog
  ) { }

  // material dialog 
  PostTwoDialogRef: MatDialogRef<PostTwoComponent>;

  ngOnInit() {
    this.screenHeight = window.screen.height - 305;
    this.scrollHeight = this.screenHeight + "px";
  }

  OpenModelQuestion() {
    let PostTwoDialogRef = this.dialog.open(PostTwoComponent, { minWidth:'50%', position: {top: '50px'},  data: { Header:'Questions Post Two Form', type:'Creat Form' } });
    PostTwoDialogRef.afterClosed().subscribe(result => console.log(result));
  }


}
