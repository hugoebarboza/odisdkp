import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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

  addEvent() {
    //console.log(event);
    this.showTime = true;
  }

}
