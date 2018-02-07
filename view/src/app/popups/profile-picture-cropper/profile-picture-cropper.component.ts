import { Component, Directive, ElementRef, Inject, OnInit } from '@angular/core';


import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';



@Component({
  selector: 'app-profile-picture-cropper',
  templateUrl: './profile-picture-cropper.component.html',
  styleUrls: ['./profile-picture-cropper.component.css']
})
export class ProfilePictureCropperComponent implements OnInit {

  UserInfo;

  constructor(
    private dialogRef: MatDialogRef<ProfilePictureCropperComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {

      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));


     }


    ngOnInit() {
    }


}
