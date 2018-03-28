import { Component, Directive, Inject, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Category4ServiceService } from './../../service/category-4-service/category-4-service.service';

import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

const uriImage = 'http://localhost:3000/API/FileUpload/UploadImage';

const uriVideo = 'http://localhost:3000/API/FileUpload/UploadVideo';

const uriFile = 'http://localhost:3000/API/FileUpload/UploadDocumetFile';

@Component({
  selector: 'app-edit-category-4-topic-post',
  templateUrl: './edit-category-4-topic-post.component.html',
  styleUrls: ['./edit-category-4-topic-post.component.css']
})
export class EditCategory4TopicPostComponent implements OnInit {

  @ViewChild('myInput') myInputVariable: any;

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';
  DocumentsBaseUrl: String = 'http://localhost:3000/static/documents';


  ActiveCategory;
  UserInfo: any;
  PostForm: FormGroup;
  ImageInputActive: Boolean = false;
  VideoInputActive: Boolean = false;
  LinkInputActive: Boolean = false;
  DocumentInputActive: Boolean = false;

  ImagesList: any[]= [];
  VideosList: any[]= [];
  DoucumentList: any[]= [];
  OldImageList: any[] = [];
  OldVideosList: any[] = [];
  OldDoucumentList: any[] = [];

  SnippetLength: Number = 10000;

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
                              maxFileSize: this.MaxImageFileSize });

  VideoUploadErrorMessage: string;
  VideoAllowedType = ['video/mp4', 'video/3gp', 'video/flv', 'video/mkv', 'video/avi'];
  MaxVideoFileSize = 104857600; // 100mp
  Videouploader: FileUploader = new FileUploader({
                                  url: uriVideo,
                                  disableMultipart: false,
                                  allowedMimeType: this.VideoAllowedType,
                                  autoUpload: false,
                                  maxFileSize: this.MaxVideoFileSize});

  FileUploadErrorMessage: string;
  FileAllowedType = ['application/pdf'];
  MaxFileSize = 104857600; // 100mp
  Fileuploader: FileUploader = new FileUploader({
                                  url: uriFile,
                                  disableMultipart: false,
                                  allowedMimeType: this.FileAllowedType,
                                  autoUpload: false,
                                  maxFileSize: this.MaxFileSize});

  constructor(
    private Service: Category4ServiceService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditCategory4TopicPostComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.ActiveCategory = this.data.type;
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
              this.snackBar.open( this.ImageUploadErrorMessage, ' ', {
                horizontalPosition: 'center',
                duration: 5000,
                verticalPosition: 'top',
              });
            };
            this.Imageuploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
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
              this.snackBar.open( this.VideoUploadErrorMessage, ' ', {
                horizontalPosition: 'center',
                duration: 5000,
                verticalPosition: 'top',
              });
            };

            this.Videouploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
              if (JSON.parse(response).status === 'True') {
                item.formData.push(JSON.parse(response).data);
              }
            };

          // File Upload
            this.Fileuploader.onBuildItemForm = (fileItem, form) => {
              form.append('UserId', this.UserInfo.data._id);
              return {fileItem, form};
            };
            this.Fileuploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
              switch (filter.name) {
                case 'fileSize':
                    this.FileUploadErrorMessage = `Maximum upload size exceeded (${item.size} of ${this.MaxImageFileSize} allowed)`;
                    break;
                case 'mimeType':
                    const allowedTypes = this.FileAllowedType.join();
                    this.FileUploadErrorMessage = `Type '${item.type} is not allowed. Allowed types: 'pdf' Only`;
                    break;
                default:
                    this.FileUploadErrorMessage = `Unknown error (filter is ${filter.name})`;
              }
              this.myInputVariable.nativeElement.value = '';
              this.snackBar.open( this.FileUploadErrorMessage, ' ', {
                horizontalPosition: 'center',
                duration: 5000,
                verticalPosition: 'top',
              });
            };

            this.Fileuploader.onCompleteItem = (item: any, response: any, status: any, headers: any ) => {
              if (JSON.parse(response).status === 'True') {
                item.formData.push(JSON.parse(response).data);
              }
            };
      }

  ngOnInit() {

    this.PostForm = new FormGroup({
      _id: new FormControl(this.data.data._id, Validators.required),
      UserId: new FormControl(this.UserInfo.data._id, Validators.required),
      TopicId: new FormControl(this.data.TopicId, Validators.required),
      PostType: new FormControl(this.data.type,  Validators.required),
      PostDate: new FormControl(new Date(), Validators.required),
      PostText: new FormControl(this.data.data.PostText),
      PostLink: new FormControl(this.data.data.PostLink),
      PostDocumnet: new FormControl(''),
      PostImage: new FormControl(''),
      PostVideo: new FormControl('')
    });

    if (this.data.data.PostLink !== '') {
      this.LinkInputActive = true;
    }
    if (this.data.data.PostImage[0] !== '') {
      this.ImageInputActive = true;
      this.OldImageList = [...this.OldImageList, ...this.data.data.PostImage];
    }
    if (this.data.data.PostVideo[0] !== '') {
      this.VideoInputActive = true;
      this.OldVideosList = [...this.OldVideosList, ...this.data.data.PostVideo];
    }
    if (this.data.data.PostDocumnet[0] !== '') {
      this.DocumentInputActive = true;
      this.OldDoucumentList = [...this.OldDoucumentList, ...this.data.data.PostDocumnet];
    }

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
  DocumentActiveToggle() {
    this.DocumentInputActive = !this.DocumentInputActive;
  }

  removeImg(index) {
    this.OldImageList.splice(index, 1);
  }
  removeVid(index) {
    this.OldVideosList.splice(index, 1);
  }
  removeDoc() {
    this.OldDoucumentList = [];
  }

  SnippetValidate(text) {
    const WordLength = text.match(/(\w+)/g).length;
    if (WordLength === 6 ) {
      const SnippetText = text.slice(0, -2);
      this.PostForm.controls['PostText'].setValue(SnippetText);
      this.snackBar.open( 'Snippet Maximum Words Limit 100 ', ' ', {
        horizontalPosition: 'center',
        duration: 5000,
        verticalPosition: 'top',
      });
    }
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
        if ( this.OldVideosList.length > 0 || this.VideosList.length > 0 ) {
          this.VideosList = [ ...this.VideosList, ...this.OldVideosList ];
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
        if ( this.OldImageList.length > 0 || this.ImagesList.length > 0 ) {
          this.ImagesList = [ ...this.ImagesList, ...this.OldImageList ];
          this.PostForm.controls['PostImage'].setValue(this.ImagesList);
        }
    }
    if (this.DocumentInputActive) {
      const DocumentQueue = this.Fileuploader.queue;
        if (DocumentQueue[0].isUploaded) {
          const QueueItemId = DocumentQueue[0].formData[0]._id;
          const QueueItemName = DocumentQueue[0].formData[0].FileName;
          this.DoucumentList.push({'DocumentId': QueueItemId, 'DocumentName': QueueItemName});
        }
        if ( this.DoucumentList.length > 0 ) {
          this.PostForm.controls['PostDocumnet'].setValue(this.DoucumentList);
        }
        if ( this.OldDoucumentList.length > 0 && this.DoucumentList.length <= 0 ) {
          this.DoucumentList = this.OldDoucumentList ;
          this.PostForm.controls['PostDocumnet'].setValue(this.DoucumentList);
        }
    }

    this.Service.Category4TopicPostUpdate(this.PostForm.value).subscribe(datas => this.ValidateData(datas));
  }

  ValidateData(datas) {
    if (datas.status) {
      this.dialogRef.close(datas.data);
    }else {
      this.dialogRef.close('Close');
    }
  }
  close() {
    this.dialogRef.close('Close');
  }
}
