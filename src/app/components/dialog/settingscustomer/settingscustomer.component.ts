import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-settingscustomer',
  templateUrl: './settingscustomer.component.html',
  styleUrls: ['./settingscustomer.component.css']
})
export class SettingscustomerComponent implements OnInit {
  public title: string;
  public columnselect: string[] = new Array();
  lastAction: string;
  checked = false;
  displayedColumns: string[] = ['cc_number', 'region', 'provincia', 'comuna', 'direccion', 'user', 'create_at', 'userupdate', 'update_at', 'actions'];
  dataColumns = new Array();

  constructor(
  	public dialogRef: MatDialogRef<SettingscustomerComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any

  	) 
  { 
	this.title = "Ver / Ocultar Columnas";  	

  }

  ngOnInit() {
  	// const checked = false;
  	//console.log(this.data);
  	for (var i=0; i<this.displayedColumns.length; i++){
  		const column = this.displayedColumns[i];
  		const checked = this.data.columnsToDisplay.indexOf(column);  		
  		if(checked !== -1){
  	     this.dataColumns[i] = { label: column, checked: true };
  		}else{
		 this.dataColumns[i] = { label: column, checked: false };  			
  		}  		
  	}
  	//console.log(this.dataColumns);

  }

  onNoClick(): void {
  	//console.log(this.dataColumns);
    return this.dialogRef.close(this.dataColumns);
  }



	onChange(_event, index, item) {	
	const checked = this.data.columnsToDisplay.indexOf(item.label);
	if(checked !== -1){		
  	     this.dataColumns[index] = { label: item.label, checked: item.checked };
	}  		
	}



}











