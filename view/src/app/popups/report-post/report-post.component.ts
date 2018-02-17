import { Component, Directive, Inject, OnInit } from '@angular/core';

import { ReportAndDeleteService } from './../../service/report-and-delete-service/report-and-delete.service';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-report-post',
  templateUrl: './report-post.component.html',
  styleUrls: ['./report-post.component.css']
})
export class ReportPostComponent implements OnInit {

  UserInfo: any;
  ActiveCategory = '01';
  ActiveText = 'Harassment';
  ErrorShow: Boolean = false;
  DontSubmit: Boolean = true;

  constructor(public snackBar: MatSnackBar,
    private ReportService: ReportAndDeleteService,
    private dialogRef: MatDialogRef<ReportPostComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        if ( this.data.type === 'Post' ) {
          this.ReportService.ReportPostValidate(this.data.values)
              .subscribe( datas => {
                if (datas.status === 'True') {
                  if (datas.ValidReport === 'True') {
                    this.DontSubmit = false;
                  }else {
                      this.snackBar.open( 'You are Already Reported This Post', ' ', {
                        horizontalPosition: 'center',
                        duration: 3000,
                        verticalPosition: 'top',
                      });
                    this.dialogRef.close('Close');
                  }
                }else {
                  console.log(datas);
                  this.dialogRef.close('Close');
                }
            });
        }

        if ( this.data.type === 'SecondLevelPost' ) {
          this.ReportService.ReportSecondLevelPostValidate(this.data.values)
              .subscribe( datas => {
                if (datas.status === 'True') {
                  if (datas.ValidReport === 'True') {
                    this.DontSubmit = false;
                  }else {
                    this.snackBar.open( 'You are Already Reported This ' + this.data.exactType , '', {
                      horizontalPosition: 'center',
                      duration: 3000,
                      verticalPosition: 'top',
                    });
                    this.dialogRef.close('Close');
                  }
                }else {
                  console.log(datas);
                  this.dialogRef.close('Close');
                }
            });
        }


      }

  ngOnInit() {

  }


  ActiveCategorySelect(id, text) {
    if (this.ActiveCategory !== id) {
      this.ActiveCategory = id;
      this.ActiveText = text;
    }
  }

  close() {
    this.dialogRef.close('Close');
  }

  submit(value) {
    if ( value !== '') {

      if (this.data.type === 'Post') {
          const ReportData = {'UserId': this.data.values.UserId,
                        'PostType': this.data.values.PostType,
                        'PostId':  this.data.values.PostId,
                        'PostUserId':  this.data.values.PostUserId,
                        'ReportCategory':  this.ActiveText,
                        'ReportText':  value,
                        'Date':  new Date(),
                      };

          this.ReportService.ReportPost(ReportData)
                      .subscribe( datas => {
                        if (datas.status === 'True') {
                          this.snackBar.open( 'Your Report Send To Our Team ', '', {
                              horizontalPosition: 'center',
                              duration: 3000,
                              verticalPosition: 'top',
                            });
                           this.dialogRef.close('Close');
                        }else {
                          this.snackBar.open( 'Failed To Report The Post Please Try Again! ', '', {
                            horizontalPosition: 'center',
                            duration: 3000,
                            verticalPosition: 'top',
                          });
                          this.dialogRef.close('Close');
                        }
                    });

      }

      if (this.data.type === 'SecondLevelPost') {
        const ReportData = {'UserId': this.data.values.UserId,
                      'PostId':  this.data.values.PostId,
                      'SecondLevelPostType': this.data.values.SecondLevelPostType,
                      'SecondLevelPostId': this.data.values.SecondLevelPostId,
                      'SecondLevelPostUserId':  this.data.values.SecondLevelPostUserId,
                      'ReportCategory':  this.ActiveText,
                      'ReportText':  value,
                      'Date':  new Date(),
                    };

        this.ReportService.ReportSecondLevelPost(ReportData)
                    .subscribe( datas => {
                      if (datas.status === 'True') {
                        this.snackBar.open( 'Your Report Send To Our Team.', '', {
                          horizontalPosition: 'center',
                          duration: 3000,
                          verticalPosition: 'top',
                        });
                         this.dialogRef.close('Close');
                      }else {
                        this.snackBar.open( 'Failed To Report Please Try Again!', '', {
                          horizontalPosition: 'center',
                          duration: 3000,
                          verticalPosition: 'top',
                        });
                        this.dialogRef.close('Close');
                      }
                  });

    }

    }else {
      this.ErrorShow = true;
      setTimeout( () => { this.ErrorShow = false; }, 4000);
    }
  }

}
