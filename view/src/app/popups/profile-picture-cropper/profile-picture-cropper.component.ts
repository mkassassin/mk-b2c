import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { PostServiceService } from './../../service/post-service/post-service.service';

import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

const uriImage = 'http://localhost:3000/API/FileUpload/ProfileUpdate';

@Component({
  selector: 'app-profile-picture-cropper',
  templateUrl: './profile-picture-cropper.component.html',
  styleUrls: ['./profile-picture-cropper.component.css']
})
export class ProfilePictureCropperComponent implements OnInit {

  UserInfo;


  ImageUploadErrorMessage: string;
  ImageAllowedType = ['image/png', 'image/jpg', 'image/jpeg'];
  MaxImageFileSize = 10485760; // 10mp
  Imageuploader: FileUploader = new FileUploader({
                              url: uriImage,
                              disableMultipart: false,
                              allowedMimeType: this.ImageAllowedType,
                              autoUpload: false,
                              maxFileSize: this.MaxImageFileSize});

  constructor(
    private Service: PostServiceService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProfilePictureCropperComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {

      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.Imageuploader.onBuildItemForm = (fileItem, form) => {
          form.append('UserId', this.UserInfo.data._id);
          return {fileItem, form};
        };
        this.Imageuploader.onAfterAddingFile = f => {
          if (this.Imageuploader.queue.length > 1) {
            this.Imageuploader.removeFromQueue(this.Imageuploader.queue[0]);
          }
        };

        this.Imageuploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
          switch (filter.name) {
            case 'fileSize':
                this.ImageUploadErrorMessage = `Maximum upload size exceeded (${item.size} of ${this.MaxImageFileSize} allowed)`;
                break;
            case 'mimeType':
                const allowedTypes = this.ImageAllowedType.join();
                this.ImageUploadErrorMessage = `Type '${item.type} is not allowed. Allowed types: '${allowedTypes}'`;
                break;
            default:
                this.ImageUploadErrorMessage = `Unknown error (filter is ${filter.name})`;
          }
          alert(this.ImageUploadErrorMessage);
        };

        this.Imageuploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
          console.log(JSON.parse(response));
          if (JSON.parse(response).status === 'True') {
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', JSON.stringify(JSON.parse(response)));
            this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
            this.dialogRef.close(JSON.parse(response));
          }
        };

     }

    close() {
      this.dialogRef.close('Close');
    }
    ngOnInit() {
    }


}
