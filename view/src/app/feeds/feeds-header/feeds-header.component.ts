import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DiscoverComponent } from './../../popups/discover/discover.component';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { SearchService } from './../../service/search-service/search.service';
import { HighlightsPostComponent } from './../../popups/posts/highlights-post/highlights-post.component';
import { QuestionsPostComponent } from './../../popups/posts/questions-post/questions-post.component';

import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
@Component({
  selector: 'app-feeds-header',
  templateUrl: './feeds-header.component.html',
  styleUrls: ['./feeds-header.component.css']
})
export class FeedsHeaderComponent implements OnInit {

  UserInfo;
  NotificationList: any;
  NotificationLoder = true;
  UsersList: any[] = [];
  TopicsList: any[] = [];
  List: any[] = [];
  SearchList: any[] = [];
  Placeholder: String = 'Loading...';
  selected: String;
  InputLoading: Boolean = true;

  constructor(private router: Router,
    private searchService: SearchService,
    private ShareingService: DataSharedVarServiceService,
    private NotifyService: SigninSignupServiceService,
    public dialog: MatDialog) {

        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

          this.NotifyService.GetNotification(this.UserInfo.data._id)
          .subscribe( datas => {
              if (datas['status'] === 'True') {
                this.NotificationList = datas['data'];
                this.NotificationLoder = false;
              }else {
                console.log(datas);
              }
            });

          this.searchService.Users(this.UserInfo.data._id)
          .subscribe( users => {
              if (users['status'] === 'True') {
                this.UsersList = users['data'];
                this.List = this.List.concat(users['data']);
                this.SearchList = [...users['data'], ...this.SearchList];
                this.Placeholder = 'Search All...';
                this.InputLoading = false;
              }else {
                console.log(users);
              }
          });

          this.searchService.Topics(this.UserInfo.data._id)
          .subscribe( topics => {
              if (topics['status'] === 'True') {
                this.TopicsList = topics['data'];
                this.SearchList = [ ...this.SearchList, ...topics['data']];
                this.Placeholder = 'Search Topics...';
                this.InputLoading = false;
              }else {
                console.log(topics);
              }
          });



     }

  SearchAll() {
    this.Placeholder = 'Search All...';
    this.SearchList = [];
    this.SearchList = [ ...this.SearchList, ...this.UsersList, ...this.TopicsList];
  }
  SearchUsers() {
    this.Placeholder = 'Search Users...';
    this.SearchList = [];
    this.SearchList = this.UsersList;
  }
  SearchTopics() {
    this.Placeholder = 'Search Topics...';
    this.SearchList = [];
    this.SearchList = this.TopicsList;
  }

  ngOnInit() {}

  OpenModelDiscover() {
    const DiscoverDialogRef = this.dialog.open(
      DiscoverComponent, {disableClose: true, minWidth: '80%', position: {top: '50px'},  data: { Header: 'Questions Post Two Form'} }
    );
    DiscoverDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  OpenModelHighlightsPost(PostId) {
    const HighlightsPostDialogRef = this.dialog.open(
      HighlightsPostComponent, {disableClose: true, minWidth: '60%', height: '90%', position: {top: '50px'},  data: { PostId: PostId } }
    );
    HighlightsPostDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  OpenModelQuestionsPost(PostId) {
    const QuestionsPostDialogRef = this.dialog.open(
      QuestionsPostComponent, {disableClose: true, minWidth: '60%', height: '90%', position: {top: '50px'},  data: { PostId: PostId } }
    );
    QuestionsPostDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  DiscoverClose(result) {
    if (result === 'Close') {
      console.log('Post Not Submit Properly');
    }else {
      console.log('Post Submited');
    }
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log(e.item._id);
  }

  LogOut() {
    const localDataString = localStorage.getItem('currentUser');
    const localData = JSON.parse(localDataString);
    this.ShareingService.SetActiveSinInsignUpTab('SingIn', localData.data.UserEmail);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('UserToken');
    this.router.navigate(['SignInSignUp']);
  }
}
