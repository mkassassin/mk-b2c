import { Component, Directive, Inject, OnInit } from '@angular/core';

import { ReportAndDeleteService } from './../../service/report-and-delete-service/report-and-delete.service';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-report-user',
  templateUrl: './report-user.component.html',
  styleUrls: ['./report-user.component.css']
})
export class ReportUserComponent implements OnInit {

  UserInfo: any;
  ActiveCategory = '01';
  ActiveText = 'Harassment';
  ErrorShow: Boolean = false;
  DontSubmit: Boolean = true;

  constructor(
    private ReportService: ReportAndDeleteService,
    private dialogRef: MatDialogRef<ReportUserComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

        this.ReportService.ReportUserValidate(this.data.values)
              .subscribe( datas => {
                if (datas.status === 'True') {
                  if (datas.ValidReport === 'True') {
                    this.DontSubmit = false;
                  }else {
                    alert('You are Already Reported This User');
                    this.dialogRef.close('Close');
                  }
                }else {
                  console.log(datas);
                  this.dialogRef.close('Close');
                }
            });

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

      const ReportUser = {'UserId': this.data.values.UserId,
                    'ReportUserId': this.data.values.ReportUserId,
                    'ReportCategory':  this.ActiveText,
                    'ReportText':  value,
                    'Date':  new Date(),
                  };

      this.ReportService.ReportUser(ReportUser)
                  .subscribe( datas => {
                    if (datas.status === 'True') {
                      alert('Your Report Send To Our Team.');
                        this.dialogRef.close('Close');
                    }else {
                      alert(' Failed To Report The User Please Try Again! ');
                      this.dialogRef.close('Close');
                    }
                });

    }else {
      this.ErrorShow = true;
      setTimeout( () => { this.ErrorShow = false; }, 4000);
    }
  }


}
