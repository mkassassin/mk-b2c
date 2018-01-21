import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feeds-trends',
  templateUrl: './feeds-trends.component.html',
  styleUrls: ['./feeds-trends.component.css']
})
export class FeedsTrendsComponent implements OnInit {

  scrollHeight;
  screenHeight:number;
  anotherHeight:number;

  constructor(
  ) { }


  ngOnInit() {
    this.screenHeight = window.screen.height - 305;
    this.scrollHeight = this.screenHeight + "px";
  }


}
