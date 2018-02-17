import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent implements OnInit {
  text;
  constructor(private dialogRef: MatDialogRef<DeleteConfirmComponent>,
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
