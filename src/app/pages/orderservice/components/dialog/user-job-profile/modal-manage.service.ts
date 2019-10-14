import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalManageService {

  data: any;
  hide: string = 'hide';

  constructor() { }


  hideModal(){
    this.hide = 'hide';
    this.data = null;
  }

  showModal(data:any){
    this.hide = '';
    this.data = data;
    //console.log(this.data);
  }
}
