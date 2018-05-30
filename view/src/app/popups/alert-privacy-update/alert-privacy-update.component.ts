import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-alert-privacy-update',
  templateUrl: './alert-privacy-update.component.html',
  styleUrls: ['./alert-privacy-update.component.css']
})
export class AlertPrivacyUpdateComponent implements OnInit {

  text;
  constructor(private dialogRef: MatDialogRef<AlertPrivacyUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      this.text = this.data.text;
     }

  ngOnInit() {
  }

  onClickYes() {
    this.dialogRef.close('Yes');
  }


  onClickNo() {
    this.dialogRef.close('No');
  }


  close() {
    this.dialogRef.close('Close');
  }
}
