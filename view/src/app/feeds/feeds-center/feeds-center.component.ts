import { Component, OnInit, ElementRef  } from '@angular/core';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';

import { TopicRoutingServiceService } from './../../service/topic-routing-service/topic-routing-service.service';

@Component({
  selector: 'app-feeds-center',
  templateUrl: './feeds-center.component.html',
  styleUrls: ['./feeds-center.component.css']
})
export class FeedsCenterComponent implements OnInit {

  ActiveTab: any;
  ActiveIndex: Number = 0;

  constructor(private elementRef: ElementRef,
      private ShareingService: DataSharedVarServiceService,
      private _topicRoutingService: TopicRoutingServiceService,
    ) {
      this.ActiveTab = this.ShareingService.GetTopicQuestions();
        if (this.ActiveTab['TopicId'] !== '') {
          this.ActiveIndex = 1;
        }else {
          this.ActiveIndex = 0;
        }

        this._topicRoutingService.listen().subscribe(() => {
          this.ActiveIndex = 1;
        });
     }


    ngOnInit() {

    }


  onTabChange(event) {
    console.log(event);
    this.ActiveIndex = event.index;
  }

}
