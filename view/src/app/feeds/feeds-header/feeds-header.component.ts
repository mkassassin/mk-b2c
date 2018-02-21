import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DiscoverTopicsComponent } from './../../popups/discover-topics/discover-topics.component';
import { DiscoverComponent } from './../../popups/discover/discover.component';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { SigninSignupServiceService } from './../../service/signin-signup-service/signin-signup-service.service';
import { SearchService } from './../../service/search-service/search.service';
import { HighlightsPostComponent } from './../../popups/posts/highlights-post/highlights-post.component';
import { QuestionsPostComponent } from './../../popups/posts/questions-post/questions-post.component';
import { PostOneComponent } from './../../popups/post-one/post-one.component';
import { PostTwoComponent } from './../../popups/post-two/post-two.component';
import { CreatTopicComponent } from './../../popups/creat-topic/creat-topic.component';
import { ComponentConnectServiceService } from './../../service/component-connect-service.service';

import { AuthService, SocialUser, FacebookLoginProvider } from 'angularx-social-login';

import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
@Component({
  selector: 'app-feeds-header',
  templateUrl: './feeds-header.component.html',
  styleUrls: ['./feeds-header.component.css']
})
export class FeedsHeaderComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

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
    private authService: AuthService,
    private searchService: SearchService,
    private ShareingService: DataSharedVarServiceService,
    private NotifyService: SigninSignupServiceService,
    public dialog: MatDialog,
    private _componentConnectService: ComponentConnectServiceService) {

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


  OpenQuestionModel() {
    const PostTwoDialogRef = this.dialog.open(PostTwoComponent,
      {disableClose: true, position: {top: '50px'},  data: { Header: 'Questions Post Two Form', type: 'Create Form' } });
    PostTwoDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }


  OpenHighlightsModel() {
    const PostOneDialogRef = this.dialog.open( PostOneComponent,
      {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Highlight Post One Form', type: 'Create Form' } });
    PostOneDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }


  OpenModelDiscover() {
    const DiscoverDialogRef = this.dialog.open(
      DiscoverComponent, {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Questions Post Two Form'} }
    );
    DiscoverDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  OpenModelDiscoverTopics() {
    const DiscoverTopicDialogRef = this.dialog.open(
      DiscoverTopicsComponent, {disableClose: true, minWidth: '50%', position: {top: '50px'},  data: { Header: 'Questions Post Two Form'} }
    );
    DiscoverTopicDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }


  OpenModelHighlightsPost(PostId) {
    const HighlightsPostDialogRef = this.dialog.open(
      HighlightsPostComponent, {disableClose: true, minWidth: '60%', height: '90%', position: {top: '50px'},  data: { PostId: PostId } }
    );
    HighlightsPostDialogRef.afterClosed().subscribe(result => this.ReloadGalleryScript());
  }

  OpenModelQuestionsPost(PostId) {
    const QuestionsPostDialogRef = this.dialog.open(
      QuestionsPostComponent, {disableClose: true, minWidth: '60%', height: '90%', position: {top: '50px'},  data: { PostId: PostId } }
    );
    QuestionsPostDialogRef.afterClosed().subscribe(result => this.ReloadGalleryScript());
  }


  OpenModelCreatTopic() {
    const CreatTopictDialogRef = this.dialog.open(
      CreatTopicComponent, {disableClose: true, minWidth: '60%', height: '90%', position: {top: '50px'},  data: { PostId: '' } }
    );
    CreatTopictDialogRef.afterClosed().subscribe(result => this.DiscoverClose(result));
  }

  ReloadGalleryScript() {
    this._componentConnectService.OnLoadGallery();
  }

  DiscoverClose(result) {
    if (result === 'Close') {
      console.log('Post Not Submit Properly');
    }else if (result === 'GoToProfile') {
      this.GotoProfile('');
    }else if (result === 'Created') {
      alert('Topic Created Successfully');
    }else {
      console.log('Post Submitted');
    }
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log(e.item._id);
  }

  LogOut() {


    const localDataString = localStorage.getItem('currentUser');
    const localData = JSON.parse(localDataString);

    if (localData.data.ProviderType) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('UserToken');
      this.router.navigate(['/']);
    }else {
     this.ShareingService.SetActiveSinInsignUpTab('SingIn', localData.data.UserEmail);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('UserToken');
      this.router.navigate(['SignInSignUp']);
    }

  }

RemoveNotify(Id, arrIndex) {
  this.NotifyService.RemoveNotification(Id)
  .subscribe( datas => {
      if (datas['status'] === 'True') {
        this.NotificationList.splice(arrIndex, 1);
      }else {
        console.log(datas);
      }
    });
}

RemoveNotifyAfterProfile(Id, arrIndex, UserId) {
  this.NotifyService.RemoveNotification(Id)
  .subscribe( datas => {
      if (datas['status'] === 'True') {
        this.NotificationList.splice(arrIndex, 1);
        this.GotoProfile(UserId);
      }else {
        console.log(datas);
      }
    });
}

  GotoMyProfile() {
    this.ShareingService.SetProfilePage('');
    this.router.navigate(['ViewProfile']);
  }

  GotoProfile(Id) {
    this.ShareingService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }
}
