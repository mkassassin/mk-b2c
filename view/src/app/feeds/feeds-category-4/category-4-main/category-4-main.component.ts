import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Category4CreateTopicComponent } from './../../../popups/category-4-create-topic/category-4-create-topic.component';

import { Category4ServiceService } from './../../../service/category-4-service/category-4-service.service';

@Component({
  selector: 'app-category-4-main',
  templateUrl: './category-4-main.component.html',
  styleUrls: ['./category-4-main.component.css']
})
export class Category4MainComponent implements OnInit {

  ActiveCategory: String = '';
  scrollHeight;
  screenHeight: number;
  anotherHeight: number;
  UserInfo;

  TopicsListView: Boolean = true;
  TopicView: Boolean = false;
  TopicsList: any = [];
  TopicData;

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private Service: Category4ServiceService,
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.Service.AllCategory4Topics().subscribe( datas => {
       this.TopicsList = datas['data'];
    });
  }

  ngOnInit() {
  }

  gotoTopicView(TopicIndex) {
    this.TopicData = this.TopicsList[TopicIndex];
    this.TopicView = true;
    this.TopicsListView = false;
  }
  gotoTopics() {
    this.Service.AllCategory4Topics().subscribe( datas => {
      this.TopicsList = datas['data'];
    });
    this.TopicView = false;
    this.TopicsListView = true;
  }

  ActiveCategorySelect( id: String) {
    if (this.ActiveCategory !== id) {
      this.ActiveCategory = id;
    }else {
      this.ActiveCategory = '';
    }
  }

  OpenModelCreatTopic() {
    const CreatTopictDialogRef = this.dialog.open(
      Category4CreateTopicComponent, {disableClose: true, maxWidth: '99%', position: {top: '50px'},  data: { PostId: '' } }
    );
    CreatTopictDialogRef.afterClosed().subscribe(result => this.Close(result));
  }

  Close(result) {
    if (result['result'] === 'Success') {
      this.TopicsList.push(result['data']);
      this.snackBar.open( 'Your New Discover Topic Successfully Created', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }else {
      this.snackBar.open( 'Discover Topic Creat Form Closed', ' ', {
        horizontalPosition: 'center',
        duration: 3000,
        verticalPosition: 'top',
      });
    }
  }


}
