import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feeds-center',
  templateUrl: './feeds-center.component.html',
  styleUrls: ['./feeds-center.component.css']
})
export class FeedsCenterComponent implements OnInit {

    scrollHeight;
    screenHeight:number;
    anotherHeight:number;
  
    constructor() { }
  
    ngOnInit() {
      this.screenHeight = window.screen.height - 305;
      this.scrollHeight = this.screenHeight + "px";
    }

  onTabChange(event) {
    console.log(event);
  }

}
