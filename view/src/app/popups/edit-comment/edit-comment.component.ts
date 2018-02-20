import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css']
})
export class EditCommentComponent implements OnInit {

  inputValue;
  UserInfo;

  constructor(private Service: CommentAndAnswerService,
    private dialogRef: MatDialogRef<EditCommentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.inputValue = this.data.data.CommentText;
   }

  ngOnInit() {
  }

  submit() {
    const sendData = {
      _id : this.data.data._id,
      CommentText: this.inputValue
    };
    this.Service.CommentUpdate(sendData)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.dialogRef.close(datas.data);
          }else {
            this.dialogRef.close('Close');
          }
      });

  }

}
