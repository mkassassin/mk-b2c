import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { PostServiceService } from "./../../service/post-service/post-service.service";


import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-post-one',
  templateUrl: './post-one.component.html',
  styleUrls: ['./post-one.component.css']
})
export class PostOneComponent implements OnInit {

  ActiveCategory = "Story";
  UserInfo:any;
  PostForm: FormGroup;
  LinkInoutActive:boolean = false;

  constructor(
    private Service: PostServiceService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PostOneComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any ) {
      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    this.PostForm = new FormGroup({
      UserId: new FormControl(this.UserInfo.data._id, Validators.required),
      PostType: new FormControl(this.ActiveCategory,  Validators.required),
      PostDate: new FormControl(new Date(), Validators.required),
      PostText: new FormControl(''),
      PostLink: new FormControl(''),
      PostImage: new FormControl(''),
      PostVideo: new FormControl('')
    });
  }

  ActiveCategorySelect(name){
    if(this.ActiveCategory != name){
      this.ActiveCategory = name;
      this.PostForm.controls['PostType'].setValue(name);   
    }
  }

  LinkInoutActiveToggle(){
    this.LinkInoutActive = !this.LinkInoutActive;
  }

  submit(){
    this.Service.HighlightsSubmit(this.PostForm.value).subscribe(datas => this.ValidateData(datas));
  }

  ValidateData(datas){
    if(datas.status){
      this.dialogRef.close(datas.data);
    }
    else{
      console.log(datas);
      this.dialogRef.close('Close');
    }
  }
  close() {
    this.dialogRef.close('Close');
  }

}
