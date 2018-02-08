import { Component, OnInit, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-feeds-center',
  templateUrl: './feeds-center.component.html',
  styleUrls: ['./feeds-center.component.css']
})
export class FeedsCenterComponent implements OnInit {

    ActiveIndex: Number = 0;
    scrollHeight;
    screenHeight: number;
    anotherHeight: number;
    constructor(private elementRef: ElementRef
    ) { }


    ngOnInit() {
      this.screenHeight = window.screen.height - 305;
      this.scrollHeight = this.screenHeight + 'px';
    }


  onTabChange(event) {
    console.log(event);
    this.ActiveIndex = event.index;
  }

}
