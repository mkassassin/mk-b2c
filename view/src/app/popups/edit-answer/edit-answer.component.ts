import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

import { CommentAndAnswerService } from './../../service/comment-and-answer-service/comment-and-answer.service';

@Component({
  selector: 'app-edit-answer',
  templateUrl: './edit-answer.component.html',
  styleUrls: ['./edit-answer.component.css']
})
export class EditAnswerComponent implements OnInit {


  inputValue;
  UserInfo;

  constructor(private Service: CommentAndAnswerService,
    private dialogRef: MatDialogRef<EditAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.inputValue = this.data.data.AnswerText;
   }

  ngOnInit() {
  }

  submit() {
    const sendData = {
      _id : this.data.data._id,
      AnswerText: this.inputValue
    };
    this.Service.AnswerUpdate(sendData)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.dialogRef.close(datas.data);
          }else {
            this.dialogRef.close('Close');
          }
      });

  }

}
