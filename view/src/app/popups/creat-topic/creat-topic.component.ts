import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { PostServiceService } from './../../service/post-service/post-service.service';

import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

const uriImage = 'http://localhost:3000/API/FileUpload/CreateTopic';

@Component({
  selector: 'app-creat-topic',
  templateUrl: './creat-topic.component.html',
  styleUrls: ['./creat-topic.component.css']
})
export class CreatTopicComponent implements OnInit {

  UserImageBaseUrl: String = 'http://localhost:3000/static/users';

  UserInfo;
  TopicName = '';
  TopicDescription;
  ErrorValue: Boolean = false;
  ShowSubmit: Boolean = false;
  ErrorText = '';

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
    private dialogRef: MatDialogRef<CreatTopicComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {

      this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.Imageuploader.onBuildItemForm = (fileItem, form) => {
          form.append('TopicName', this.TopicName);
          form.append('TopicDescription', this.TopicDescription);
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
          if (JSON.parse(response).status === 'True') {
            this.dialogRef.close('Created');
          }else {
            this.dialogRef.close('Close');
          }
        };

     }

    SubmitData() {
      this.ShowSubmit = true;
      if (this.TopicName !== '' && (this.Imageuploader.queue).length > 0) {
        this.Service.TopicNameValidate(this.TopicName).subscribe( datas => {
          const data: any = datas;
          if ( data.status === 'True' && data.available === 'True' ) {
            this.ShowSubmit = true;
            this.ErrorValue = false;
            this.ErrorText = '';
            this.Imageuploader.queue[0].upload();
          }else if ( data.status === 'True' && data.available === 'False' ) {
            this.ShowSubmit = false;
            this.ErrorValue = true;
            this.ErrorText = 'Topic Name is Already Registerd';
          }else {
            this.ShowSubmit = false;
            this.ErrorValue = true;
            this.ErrorText = 'Some Error Occurred Please Try Again';
          }
         } );


      }else if ( this.TopicName === '') {
        this.ShowSubmit = false;
        this.ErrorValue = true;
        this.ErrorText = 'Topic Name is Required';
      }else {
        this.ShowSubmit = false;
        this.ErrorValue = true;
        this.ErrorText = 'Topic Image is Required';
      }
    }

    close() {
      this.dialogRef.close('Close');
    }
    ngOnInit() {
    }

}
