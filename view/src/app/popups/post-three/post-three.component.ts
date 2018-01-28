import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

@Component({
  selector: 'app-post-three',
  templateUrl: './post-three.component.html',
  styleUrls: ['./post-three.component.css']
})
export class PostThreeComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PostThreeComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any ) { }

  ngOnInit() {
    console.log(this.data);
  }

  close() {
    this.dialogRef.close(this.data);
  }

}
