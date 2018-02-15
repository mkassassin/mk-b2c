import { Component, Directive, Inject, OnInit } from '@angular/core';

import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-report-user',
  templateUrl: './report-user.component.html',
  styleUrls: ['./report-user.component.css']
})
export class ReportUserComponent implements OnInit {

  UserInfo: any;
  ActiveCategory = '01';

  constructor(
    private ShareService: DataSharedVarServiceService,
    private dialogRef: MatDialogRef<ReportUserComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ) {
        this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

      }

  ngOnInit() {

  }

  // followUser(Id: String) {
  //   const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : Id };
  //   const index = this.DiscoverPeoples.findIndex(x => x._id === Id);
  //     this.Service.FollowUser(data)
  //       .subscribe( datas => {
  //         if (datas.status === 'True') {
  //           this.DiscoverPeoples.splice(index , 1);
  //         }else {
  //           console.log(datas);
  //         }
  //     });
  // }


  ActiveCategorySelect(id) {
    if (this.ActiveCategory !== id) {
      this.ActiveCategory = id;
    }
  }

  close() {
    this.dialogRef.close('Close');
  }



}
