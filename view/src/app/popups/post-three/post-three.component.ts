import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

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

  constructor(
    private dialogRef: MatDialogRef<PostThreeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
       this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close('Close');
  }
  Submit() {
    this.dialogRef.close({'PostText': this.PostText});
  }
}
