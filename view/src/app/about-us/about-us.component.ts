import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  ActivePage: String = '01';

  constructor() { }


  ngOnInit() {
  }

  ActivePageChange(count: string) {
    this.ActivePage = count;
  }

}
