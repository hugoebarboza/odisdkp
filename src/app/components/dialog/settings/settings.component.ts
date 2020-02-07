import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public title: string;
  public columnselect: string[] = new Array();
  lastAction: string;
  checked = false;
  
  
    displayedColumns: string[] = ['important','order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'user', 'userupdate', 'userassigned','create_at', 'update_at', 'time', 'estatus', 'actions']; 
  //displayedColumns: string[] = ['important','order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'user', 'userupdate', 'userassigned','create_at', 'update_at', 'estatus', 'actions']; 
  //displayedColumns: string[] = ['order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'estatus', 'user', 'create_at', 'actions']; 
  dataColumns = new Array();

  constructor(
  	public dialogRef: MatDialogRef<SettingsComponent>,
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
  		const checked = this.data.columnsOrderToDisplay.indexOf(column);  		
  		if(checked !== -1){
  	     this.dataColumns[i] = { label: column, checked: true, color : 'primary' };
  		}else{
		 this.dataColumns[i] = { label: column, checked: false, color : 'accent' };  			
  		}  		
  	}
  	//console.log(this.dataColumns);

  }

  onNoClick(): void {
  	//console.log(this.dataColumns);
    return this.dialogRef.close(this.dataColumns);
  }


/*
  removeColumn(indexcolumn: string) {
        if (indexcolumn != null) {
        //console.log('paso');
        this.columnselect.push(indexcolumn);
        }            
    //this.columnselect = indexcolumn;
    //console.log(this.columnselect);
  }

	onChange(event, index, item) {
      item = !item;
      const indexarray = this.columnselect.indexOf(index);
      //this.lastAction = 'index: ' + index + ', label: ' + item + ', checked: ' + item;
      //console.log(index, event, item);

      if(event.checked === true){
        this.columnselect.push(index);
      }

      if(event.checked === false){
      	this.columnselect.splice(indexarray, 1);
      }

      //console.log(this.columnselect);
}
*/

	onChange(_event, index, item) {

	//console.log(index);
    //console.log(item.label);
  	//console.log(checked);
  	//console.log(item.checked);
  	
	const checked = this.data.columnsOrderToDisplay.indexOf(item.label);
	if(checked !== -1){		
  	     this.dataColumns[index] = { label: item.label, checked: item.checked };
	}  		

     //console.log(this.dataColumns);
	}


/*
  onChange(event, index, item) {

      item.checked = !item.checked;

      this.lastAction = 'index: ' + index + ', label: ' + item.label + ', checked: ' + item.checked;

      console.log(index, event, item);

  }
*/

}











