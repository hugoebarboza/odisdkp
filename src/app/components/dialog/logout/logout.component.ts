import { Component  } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent  {

  constructor(
	public dialogRef: MatDialogRef<LogoutComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: DialogData
  	) { }



  onNoClick(): void {
    this.dialogRef.close();
  }


}

export interface DialogData {
  id: number;
  title: string;
}