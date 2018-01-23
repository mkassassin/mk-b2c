import { Component, OnInit } from '@angular/core';

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
  ) { }


  ngOnInit() {
    this.screenHeight = window.screen.height - 270;
    this.impresionscreenHeight = window.screen.height - 380;
    this.scrollHeight = this.screenHeight + "px";
    this.impresionsHeight = this.impresionscreenHeight + "px";
  }

  onTabChange(event) {
    console.log(event);
  }

}
