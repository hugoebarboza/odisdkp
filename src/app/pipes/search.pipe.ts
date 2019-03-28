import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!args){
      return value;
    }
    //console.log(value);
    //console.log(args);
    return value.filter((val)=>{
      console.log(val)
      let rVal=(val.userassigned.toLocaleLowerCase().includes(args)) || (val.direccion.toLocaleLowerCase().includes(args))  || (val.cc_number.toLocaleLowerCase().includes(args)) || (val.order_number.toString().includes(args) );
      return rVal;
    })
    
  }

}