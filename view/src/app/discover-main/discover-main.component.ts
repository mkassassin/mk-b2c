import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discover-main',
  templateUrl: './discover-main.component.html',
  styleUrls: ['./discover-main.component.css']
})
export class DiscoverMainComponent implements OnInit {

  ActiveCategory: String = '';
  constructor() { }

  ngOnInit() {
  }

  ActiveCategorySelect( id: String) {
    if (this.ActiveCategory !== id) {
      this.ActiveCategory = id;
    }else {
      this.ActiveCategory = '';
    }
  }


}
