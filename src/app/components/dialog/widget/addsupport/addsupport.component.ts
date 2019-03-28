import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({  
  selector: 'app-addsupport',
  templateUrl: './addsupport.component.html',
  styleUrls: ['./addsupport.component.css']
})
export class AddSupportComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddSupportComponent>
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
