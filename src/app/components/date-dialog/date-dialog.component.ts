import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent} from '@angular/material';

@Component({
  selector: 'app-date-dialog',
  templateUrl: './date-dialog.component.html',
  styles: ['.mat-form-field {width: 100%;}']
})
export class DateDialogComponent implements OnInit {
  showTime = false;

  constructor(
    public dialogRef: MatDialogRef<DateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data ) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log(event);
    this.showTime = true;
  }

}
