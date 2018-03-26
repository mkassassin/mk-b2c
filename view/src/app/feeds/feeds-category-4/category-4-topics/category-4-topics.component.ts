import { Component, OnInit, Input, Output, EventEmitter   } from '@angular/core';

@Component({
  selector: 'app-category-4-topics',
  templateUrl: './category-4-topics.component.html',
  styleUrls: ['./category-4-topics.component.css']
})
export class Category4TopicsComponent implements OnInit {

  Category4TopicImageBaseUrl: String = 'http://localhost:3000/static/category-4-topics';

  @Input() ListOfTopics: any;

  @Output() gotoTopic = new EventEmitter();

  constructor() {
   }

  viewTopic(TopicIndex) {
    this.gotoTopic.next(TopicIndex);
  }

  ngOnInit() {

  }

}
