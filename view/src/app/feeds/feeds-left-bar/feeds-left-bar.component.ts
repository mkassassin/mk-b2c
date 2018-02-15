import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';

@Component({
  selector: 'app-feeds-left-bar',
  templateUrl: './feeds-left-bar.component.html',
  styleUrls: ['./feeds-left-bar.component.css']
})
export class FeedsLeftBarComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  scrollHeight;
  screenHeight: number;
  UserInfo: any;
  UnfollowingUsers: any[];
  UnFollowingTopics: any[];
  UserLoader: Boolean = true;
  ActiveCategory = '01';
  TopicLoader: Boolean = true;

  constructor(private router: Router,
      private FollowService: FollowServiceService,
      private ShareService: DataSharedVarServiceService) {
                    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

                    this.FollowService.UnFollowingTopics(this.UserInfo.data._id)
                    .subscribe( topicdatas => {
                        if (topicdatas['status'] === 'True') {
                          this.TopicLoader = false;
                          this.UnFollowingTopics = topicdatas['data'];
                        }else {
                          this.TopicLoader = false;
                          console.log(topicdatas);
                        }
                      });

                    this.FollowService.UnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
                    .subscribe( userdatas =>  {
                      if (userdatas['status'] === 'True') {
                        this.UserLoader = false;
                        this.UnfollowingUsers = userdatas['data'];
                      }else {
                        this.UserLoader = false;
                        console.log(userdatas);
                      }
                    });

              }


  ngOnInit() {
    this.screenHeight = window.innerHeight - 70;
    this.scrollHeight = this.screenHeight + 'px';
  }

  ActiveCategorySelect(id) {
      if (this.ActiveCategory !== id) {
        this.UserLoader = true;
        this.UnfollowingUsers = [];
        this.ActiveCategory = id;
        this.FollowService.UnFollowingUsers(this.UserInfo.data._id, this.ActiveCategory)
        .subscribe( userdatas =>  {
              if (userdatas['status'] === 'True') {
                this.UserLoader = false;
                this.UnfollowingUsers = userdatas['data'];
              }else {
                this.UserLoader = false;
                console.log(userdatas);
              }
        });
      }
  }

  followTopic(Id: String) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingTopicId' : Id };
    const index = this.UnFollowingTopics.findIndex(x => x._id === Id);
      this.FollowService.FollowTopic(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.UnFollowingTopics.splice(index , 1);
          }else {
            console.log(datas);
          }
      });
  }

  followUser(Id: String) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : Id };
    const index = this.UnfollowingUsers.findIndex(x => x._id === Id);
      this.FollowService.FollowUser(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.UnfollowingUsers.splice(index , 1);
          }else {
            console.log(datas);
          }
      });
  }





  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['Profile']);
  }


}
