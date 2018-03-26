import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Category4ServiceService } from './../../service/category-4-service/category-4-service.service';

import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

const uriImage = 'http://localhost:3000/API/Category4Topics/Category4CreateTopic';

@Component({
  selector: 'app-category-4-create-topic',
  templateUrl: './category-4-create-topic.component.html',
  styleUrls: ['./category-4-create-topic.component.css']
})
export class Category4CreateTopicComponent implements OnInit {

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
    private Service: Category4ServiceService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<Category4CreateTopicComponent>,
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
            this.dialogRef.close({result: 'Success', data: JSON.parse(response).data});
          }else {
            this.dialogRef.close({result: 'Close'});
          }
        };

     }

    SubmitData() {
      this.ShowSubmit = true;
      if (this.TopicName !== '' && (this.Imageuploader.queue).length > 0) {
        this.Service.Category4TopicNameValidate(this.TopicName).subscribe( datas => {
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
      this.dialogRef.close({result: 'Close'});
    }
    ngOnInit() {
    }

}
