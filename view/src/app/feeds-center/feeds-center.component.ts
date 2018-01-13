import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


import { PostOneComponent } from './../popups/post-one/post-one.component'

@Component({
  selector: 'app-feeds-center',
  templateUrl: './feeds-center.component.html',
  styleUrls: ['./feeds-center.component.css']
})
export class FeedsCenterComponent implements OnInit {

    scrollHeight;
    screenHeight:number;
    anotherHeight:number;
  
    constructor(
      public dialog: MatDialog
    ) { }
  
    // material dialog 
    PostOneDialogRef: MatDialogRef<PostOneComponent>;

    ngOnInit() {
      this.screenHeight = window.screen.height - 305;
      this.scrollHeight = this.screenHeight + "px";
    }

    OpenModel() {
      let PostOneDialogRef = this.dialog.open(PostOneComponent, { width:'50%', data: { Header:'Highlight Post One Form', type:'Creat Form' } });
      PostOneDialogRef.afterClosed().subscribe(result => console.log(result));
    }


  onTabChange(event) {
    console.log(event);
  }

}
