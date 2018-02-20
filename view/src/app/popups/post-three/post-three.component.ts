import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

import { TrendsService } from './../../service/trends-service/trends.service';

@Component({
  selector: 'app-post-three',
  templateUrl: './post-three.component.html',
  styleUrls: ['./post-three.component.css']
})
export class PostThreeComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  UserInfo;
  PostText;
  InputValue;
  title = '';

  constructor( private service: TrendsService,
    private dialogRef: MatDialogRef<PostThreeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
       this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    if (this.data.type === 'Edit') {
      this.PostText = this.data.data.PostText;
      this.title = 'Edit Opinion';
    }else {
      this.title = 'Write Your Opinion';
    }

  }

  close() {
    this.dialogRef.close('Close');
  }
  Submit() {
    if (this.data.type === 'Edit') {
      const sendData = {
        _id : this.data.data._id,
        PostText: this.PostText
      };
      this.service.ImpressionUpdate(sendData)
      .subscribe( datas => {
        if (datas.status === 'True') {
          this.dialogRef.close(datas.data);
        }else {
          this.dialogRef.close('Close');
        }
    });
    }else {
      this.dialogRef.close({'PostText': this.PostText});
    }
  }
}
