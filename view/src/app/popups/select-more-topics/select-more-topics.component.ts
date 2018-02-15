import { Component, Directive, Inject, OnInit } from '@angular/core';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';

import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-select-more-topics',
  templateUrl: './select-more-topics.component.html',
  styleUrls: ['./select-more-topics.component.css']
})
export class SelectMoreTopicsComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  UserInfo: any;
  DiscoverTopics: any[];
  LoadingTopics: Boolean = true;

  constructor(
    private Service: FollowServiceService,
    private dialogRef: MatDialogRef<SelectMoreTopicsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.Service.AllFollowingTopics(this.UserInfo.data._id)
        .subscribe( datas =>  {
          if (datas['status'] === 'True') {
            this.LoadingTopics = false;
            this.DiscoverTopics = datas['data'];
          }else {
            this.LoadingTopics = false;
            console.log(datas);
          }
        });


      }

  ngOnInit() {

  }

  SelectTopic(Topic) {
    this.dialogRef.close(Topic);
  }



  close() {
    this.dialogRef.close('Close');
  }

}
