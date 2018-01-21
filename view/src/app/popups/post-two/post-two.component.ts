import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-post-two',
  templateUrl: './post-two.component.html',
  styleUrls: ['./post-two.component.css']
})
export class PostTwoComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PostTwoComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any ) { }

  ngOnInit() {
    console.log(this.data);
  }

  close() {
    this.dialogRef.close(this.data);
  }

}
