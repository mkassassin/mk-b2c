import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.css']
})
export class ProfileTimelineComponent implements OnInit {
  scrollHeight;
  screenHeight:number;
  anotherHeight:number;

  constructor() { }

  ngOnInit() {
    this.screenHeight = window.screen.height - 280;
    this.scrollHeight = this.screenHeight + "px";
  }

}
