import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


import { PostOneComponent } from './../../popups/post-one/post-one.component';


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
    let PostOneDialogRef = this.dialog.open(PostOneComponent, { minWidth:'50%', position: {top: '50px'},  data: { Header:'Highlight Post One Form', type:'Creat Form' } });
    PostOneDialogRef.afterClosed().subscribe(result => console.log(result));
  }
}
