import { Component, Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { PostServiceService } from './../../service/post-service/post-service.service';

import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

const uriImage = 'http://localhost:3000/API/FileUpload/UploadImage';

const uriVideo = 'http://localhost:3000/API/FileUpload/UploadVideo';

@Component({
  selector: 'app-post-one',
  templateUrl: './post-one.component.html',
  styleUrls: ['./post-one.component.css']
})
export class PostOneComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  ActiveCategory = 'Story';
  UserInfo: any;
  PostForm: FormGroup;
  ImageInputActive: Boolean = false;
  VideoInputActive: Boolean = false;
  LinkInputActive: Boolean = false;

  ImagesList: any[]= [];
  VideosList: any[]= [];

  ImageUploadErrorMessage: string;
  ImageAllowedType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg'];
  MaxImageFileSize = 10485760; // 10mp
  Imageuploader: FileUploader = new FileUploader({
                              url: uriImage,
                              disableMultipart: false,
                              additionalParameter: {
                                comments: 'sdfsfsdfsdfsdfsdf'
                              },
                              allowedMimeType: this.ImageAllowedType,
                              autoUpload: false,
                              maxFileSize: this.MaxImageFileSize});


  VideoUploadErrorMessage: string;
  VideoAllowedType = ['video/mp4', 'video/3gp', 'video/flv', 'video/mkv', 'video/avi'];
  MaxVideoFileSize = 104857600; // 100mp
  Videouploader: FileUploader = new FileUploader({
                                  url: uriVideo,
                                  disableMultipart: false,
                                  allowedMimeType: this.VideoAllowedType,
                                  autoUpload: false,
                                  maxFileSize: this.MaxVideoFileSize});

  constructor(
    private Service: PostServiceService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PostOneComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        // Image Upload
            this.Imageuploader.onBuildItemForm = (fileItem, form) => {
              form.append('UserId', this.UserInfo.data._id);
              return {fileItem, form};
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
                item.formData.push(JSON.parse(response).data);
              }
            };


        // Video Upload
            this.Videouploader.onBuildItemForm = (fileItem, form) => {
              form.append('UserId', this.UserInfo.data._id);
              return {fileItem, form};
            };
            this.Videouploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
              switch (filter.name) {
                case 'fileSize':
                    this.VideoUploadErrorMessage = `Maximum upload size exceeded (${item.size} of ${this.MaxImageFileSize} allowed)`;
                    break;
                case 'mimeType':
                    const allowedTypes = this.ImageAllowedType.join();
                    this.VideoUploadErrorMessage = `Type '${item.type} is not allowed. Allowed types: '${allowedTypes}'`;
                    break;
                default:
                    this.VideoUploadErrorMessage = `Unknown error (filter is ${filter.name})`;
              }
              alert(this.VideoUploadErrorMessage);
            };

            this.Videouploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
              console.log(JSON.parse(response));
              if (JSON.parse(response).status === 'True') {
                item.formData.push(JSON.parse(response).data);
              }
            };
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

  checking(item) {
    console.log(this.Videouploader);
  }

  ActiveCategorySelect(name) {
    if (this.ActiveCategory !== name) {
      this.ActiveCategory = name;
      this.PostForm.controls['PostType'].setValue(name);
    }
  }

  ImageInputActiveToggle() {
    this.ImageInputActive = !this.ImageInputActive;
  }

  VideoInputActiveToggle() {
    this.VideoInputActive = !this.VideoInputActive;
  }

  LinkInputActiveToggle() {
    this.LinkInputActive = !this.LinkInputActive;
  }

  submit() {
    if (this.VideoInputActive) {
      const VideoQueue = this.Videouploader.queue;
        for (var i in VideoQueue) {
          if (VideoQueue[i].isUploaded) {
            const QueueItemId = VideoQueue[i].formData[0]._id;
            const QueueItemName = VideoQueue[i].formData[0].FileName;
            this.VideosList.push({'VideoId': QueueItemId, 'VideoName': QueueItemName});
          }
        }
        if ( this.VideosList.length > 0 ) {
          this.PostForm.controls['PostVideo'].setValue(this.VideosList);
        }
    }
    if (this.ImageInputActive) {
      const ImageQueue = this.Imageuploader.queue;
        for (var i in ImageQueue) {
          if (ImageQueue[i].isUploaded) {
            const QueueItemId = ImageQueue[i].formData[0]._id;
            const QueueItemName = ImageQueue[i].formData[0].FileName;
            this.ImagesList.push({'ImageId': QueueItemId, 'ImageName': QueueItemName});
          }
        }
        if ( this.ImagesList.length > 0 ) {
          this.PostForm.controls['PostImage'].setValue(this.ImagesList);
        }
    }

    this.Service.HighlightsSubmit(this.PostForm.value).subscribe(datas => this.ValidateData(datas));
  }

  ValidateData(datas) {
    if (datas.status) {
      this.dialogRef.close(datas.data);
    }else {
      console.log(datas);
      this.dialogRef.close('Close');
    }
  }
  close() {
    this.dialogRef.close('Close');
  }

}
