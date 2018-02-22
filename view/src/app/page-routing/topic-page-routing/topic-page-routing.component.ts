import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topic-page-routing',
  templateUrl: './topic-page-routing.component.html',
  styleUrls: ['./topic-page-routing.component.css']
})
export class TopicPageRoutingComponent implements OnInit {

  constructor(private router: Router) { this.router.navigate(['Feeds']); }

  ngOnInit() {
  }

}
