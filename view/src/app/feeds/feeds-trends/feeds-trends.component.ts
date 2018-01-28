import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


import { PostThreeComponent } from './../../popups/post-three/post-three.component';

@Component({
  selector: 'app-feeds-trends',
  templateUrl: './feeds-trends.component.html',
  styleUrls: ['./feeds-trends.component.css']
})
export class FeedsTrendsComponent implements OnInit {

  scrollHeight;
  impresionsHeight;
  screenHeight:number;
  impresionscreenHeight:number;
  anotherHeight:number;

  constructor(
    public dialog: MatDialog
  ) { }

    // material dialog 
    PostThreeDialogRef: MatDialogRef<PostThreeComponent>;

  ngOnInit() {
    this.screenHeight = window.innerHeight - 125;
    this.impresionscreenHeight = window.innerHeight - 400;
    this.scrollHeight = this.screenHeight + "px";
    this.impresionsHeight = this.impresionscreenHeight + "px";
  }

  OpenModel() {
    let PostThreeDialogRef = this.dialog.open(PostThreeComponent, { minWidth:'50%', position: {top: '50px'},  data: { Header:'Impression Post Three Form', type:'Creat Form' } });
    PostThreeDialogRef.afterClosed().subscribe(result => console.log(result));
  }

  onTabChange(event) {
    console.log(event);
  }

}
