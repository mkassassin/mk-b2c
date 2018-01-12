import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feeds-center',
  templateUrl: './feeds-center.component.html',
  styleUrls: ['./feeds-center.component.css']
})
export class FeedsCenterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onTabChange(event) {
    console.log(event);
  }

}
