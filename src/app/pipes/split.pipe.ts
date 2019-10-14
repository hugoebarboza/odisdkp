import { Pipe, PipeTransform} from '@angular/core'
// import {BrowserModule} from '@angular/platform-browser'

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  public array = new Array();
  public newarray = new Array();


  transform(value: any, args?: any): any {

	let bandera = false;
	let x = 0;
  	let filterkey = args;
  	let findarray = new Array();
  	this.array = JSON.parse(value);
	
	if(args){
	for (var propiedad in this.array) {
		this.newarray = this.array[propiedad];
		for (var i=0; i<this.newarray.length; i++){			
			if((this.newarray[i] != filterkey) && (filterkey != "S/N")){
				findarray.push(this.newarray[i]['value']);
				bandera = true;
				x = i;
			}

		}
	    const indexarray = findarray.indexOf(filterkey);
        if (indexarray !== -1) {
			bandera = false;
        }     

	    if(bandera==true && filterkey !== null && typeof filterkey !== 'undefined'){	    	
	    	this.array[propiedad][x+1] = {value: filterkey};
	    	bandera = false;
	    }
    }
  	}
  	return Object.values(this.array);

  	//var arg = args;
    //console.log(propiedad);
    //console.log(this.array[propiedad]);

  }


}
