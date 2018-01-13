import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-post-one',
  templateUrl: './post-one.component.html',
  styleUrls: ['./post-one.component.css']
})
export class PostOneComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PostOneComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any ) { }

  ngOnInit() {
    console.log(this.data);
  }

  close() {
    this.dialogRef.close(this.data);
  }

}
