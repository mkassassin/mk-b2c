import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-page-routing',
  templateUrl: './page-routing.component.html',
  styleUrls: ['./page-routing.component.css']
})
export class PageRoutingComponent implements OnInit {

  constructor(private router: Router) { this.router.navigate(['Profile']); }

  ngOnInit() {
  }

}
