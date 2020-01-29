import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-date-dialog',
  templateUrl: './date-dialog.component.html',
  styles: ['.mat-form-field {width: 100%;}']
})
export class DateDialogComponent implements OnInit {
  showTime = false;
  mindate = new Date();

  constructor(
    public dialogRef: MatDialogRef<DateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data ) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
  }

  addEvent(_change: any, _event: any) {
    // console.log(event);
    this.showTime = true;
  }

}
