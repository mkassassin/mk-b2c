import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { PostServiceService } from './../service/post-service/post-service.service';
import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';
import { ShareReturnSinginSignupComponent } from './../popups/share-return-singin-signup/share-return-singin-signup.component';

@Component({
  selector: 'app-share-post-return-page',
  templateUrl: './share-post-return-page.component.html',
  styleUrls: ['./share-post-return-page.component.css']
})
export class SharePostReturnPageComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  UserInfo;
  PostsList: any;
  PostsListLoder: Boolean = true;
  PostType;

  constructor(private Service: PostServiceService,
    private ShareService: DataSharedVarServiceService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private _route: Router,
    private Active_route: ActivatedRoute
  ) {
    console.log(this.Active_route.snapshot.params['PostId']);
    console.log(this.Active_route.snapshot.params['PostType']);

    this.ShareService.SetSharePost(this.Active_route.snapshot.params['PostId'], this.Active_route.snapshot.params['PostType']);

    this.PostType = this.Active_route.snapshot.params['PostType'];

    if (this.PostType === 't_1' ) {
      this.Service.ViewHighlightSharePost(this.Active_route.snapshot.params['PostId'])
      .subscribe( datas => {
          if (datas['status'] === 'True') {
            this.PostsList = datas['data'];
            this.PostsListLoder = false;

            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = './../../../assets/html5gallery/html5gallery.js';
            this.elementRef.nativeElement.appendChild(s);

          }else {
            console.log(datas);
            this.PostsListLoder = false;
          }
        });
    }

    if ( this.PostType === 't_2' ) {
      this.Service.ViewQuestionsSharePost(this.Active_route.snapshot.params['PostId'])
      .subscribe( datas => {
          if (datas['status'] === 'True') {
            this.PostsList = datas['data'];
            this.PostsListLoder = false;

            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = './../../../assets/html5gallery/html5gallery.js';
            this.elementRef.nativeElement.appendChild(s);

          }else {
            console.log(datas);
            this.PostsListLoder = false;
          }
        });
    }

   }

  ngOnInit() {
    this.ShareService.SetReturnUrl('', '');
    this.ShareService.SetActiveSinInsignUpTab('', '');
    if (localStorage.getItem('currentUser')) {
        const LoginDate = new Date(atob(localStorage.getItem('UserToken'))).getTime();
        const NewDate = new Date().getTime();
        const time = NewDate - LoginDate;
        const diffInHours: number = time / 1000 / 60 / 60;
        if (diffInHours < 2) {
          this._route.navigate(['Feeds']);
        }else {
            this.ShareService.SetActiveSinInsignUpTab('SingIn', JSON.parse(localStorage.getItem('currentUser')).data.UserEmail);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('UserToken');
            this.gotoSignIn();
        }
    }else {
        this.ShareService.SetActiveSinInsignUpTab('SingUp');
        this.gotoSignIn();
    }
  }

  gotoSignIn() {
    const SelectTopicDialogRef = this.dialog.open( ShareReturnSinginSignupComponent,
      { disableClose: true, minWidth: '550px', position: {top: '50px'},
        data: { Header: 'Select Topics'  } });
        SelectTopicDialogRef.afterClosed().subscribe(final => {
          if (final === 'Success') {
            this._route.navigate(['Feeds']);
          }
      });
  }

  RatingImage(isActive: boolean) {
    return `assets/images/icons/like${isActive ? 'd' : ''}.png`;
  }


}
