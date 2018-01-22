import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-right-bar',
  templateUrl: './profile-right-bar.component.html',
  styleUrls: ['./profile-right-bar.component.css']
})
export class ProfileRightBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onTabChange(event) {
    console.log(event);
  }

}
