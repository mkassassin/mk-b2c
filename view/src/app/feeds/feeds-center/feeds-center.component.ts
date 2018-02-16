import { Component, OnInit, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-feeds-center',
  templateUrl: './feeds-center.component.html',
  styleUrls: ['./feeds-center.component.css']
})
export class FeedsCenterComponent implements OnInit {

    ActiveIndex: Number = 0;
    constructor(private elementRef: ElementRef
    ) { }


    ngOnInit() {
    }


  onTabChange(event) {
    console.log(event);
    this.ActiveIndex = event.index;
  }

}
