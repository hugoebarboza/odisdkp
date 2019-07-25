import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

//MODELS
import { AtributoFirma, Order, OrderAtributoFirma, User } from 'src/app/models/types';

//SERVICES
import { OrderserviceService, SettingsService,  UserService} from 'src/app/services/service.index';

//PDF
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';  


@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit, OnDestroy {

  atributo = [];  
  atributofirma: AtributoFirma[] = [];
  counter;
  identity:any;
  imageRows = [];
  isloading:boolean;
  isImageLoading:boolean;
  listimageorder = [];
  order: Order[] = [];
  order_id:number;
  orderatributo= [];
  orderatributofirma: OrderAtributoFirma[] = [];
  rotationAmount:number = 0;
  show:boolean = true;
  service_id:number;
  sign:boolean = false;
  sub: any;
  subscription: Subscription;
  token:any;
  usercreate:User[];
  userupdate:User[];


  constructor(
    private _orderService: OrderserviceService,
    private _route: ActivatedRoute,
    public _userService: UserService,
    public label: SettingsService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.show = true;
    this.sub = this._route.params.subscribe(params => {
      this.service_id = params.serviceid;
      this.order_id = params.orderid;
    });

    this.label.getDataRoute().subscribe(data => {
      //console.log(data);
    });


  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  public loadData(){
    if(this.service_id > 0 && this.order_id > 0){
      this.isloading = true;
      this.getListImage();
      this.subscription = this._orderService.getShowOrderService(this.token.token, this.service_id, this.order_id).subscribe(
      response => {
        if(!response){
          this.isloading = false;
          return;
        }       
          this.order = response.datos;          
        if(this.order.length > 0){
              this.atributo = response.atributo;
              this.orderatributo = response.orderatributo;
              if(this.order[0].sign && this.order[0].sign > 0){
                this.sign = true;            
                if(this.order[0].usercreate_id && this.order[0].usercreate_id >0 ){
                  this.usercreate = this.order[0].usercreate_id; 
                }
                if(this.order[0].userupdate_id && this.order[0].userupdate_id >0 ){
                  this.userupdate = this.order[0].userupdate_id; 
                }
              }
              if(this.order[0].orderatributofirma.length > 0){
                this.orderatributofirma = this.order[0].orderatributofirma;
              }
              if(this.order[0].atributo_firma.length > 0){
                this.atributofirma = this.order[0].atributo_firma;
              }
                this.isloading = false;
          } else{    
                this.isloading = false;
          }
      },
      error => {
        this.isloading = false;
        console.log(<any>error);
        }
      );
    }
 }


rotateImage(direction, image) {
  this.rotationAmount += direction == 'left' ? -45 : 45;    
  document.getElementById(image).style.transform = `rotate(${this.rotationAmount}deg)`;
}

submit() {
// emppty stuff
}



public getListImage(){     

  if(this.token.token && this.order_id){
    this.isImageLoading = true;
    this.subscription = this._orderService.getListImageOrder(this.token.token, this.order_id).subscribe(
    response => {        
      if(!response){
        this.isImageLoading = false;
        return;        
      }
        if(response.status == 'success'){ 
          this.listimageorder = response.datos;
          if(this.listimageorder.length>0){
            this.getSplitArray(this.listimageorder, 2);
          }
          this.counter = this.listimageorder.length;
        }
          this.isImageLoading = false;
    },
        error => {
        this.isImageLoading = false;
        console.log(<any>error);
        }   
    );
  }
}


public getSplitArray (list, columns) {
   let array = list;
   if (array.length <= columns) {
     array.length = 2;
      //return [array];
   };

      var rowsNum = Math.ceil(array.length / columns);
      var rowsArray = new Array(rowsNum);

      for (var i = 0; i < rowsNum; i++) {
          var columnsArray = new Array(columns);
          for (var j = 0; j < columns; j++) {
              var index = i * columns + j;

              if (index < array.length) {
                  columnsArray[j] = array[index];
              } else {
                  break;
              }
          }
          rowsArray[i] = columnsArray;
      }
      this.imageRows = rowsArray
      
      //return rowsArray;
      //console.log(this.imageRows)
  }  



public print(divName: any) {
  var innerContents = document.getElementById(divName).innerHTML;
  var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
  popupWinindow.document.open();
  popupWinindow.document.write('<html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" /></head><body onload="window.print()">' + innerContents + '</html>');
  //popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="./show.component.css" /></head><body onload="window.print()">' + innerContents + '</html>');
  popupWinindow.document.close();
}





public downloadPDF(divName:any){



//OUR IMPLEMENTATION
 var data = document.getElementById(divName);  
  html2canvas(data).then(canvas => {  
    // Few necessary setting options  
    var imgWidth = 201;   
    var pageHeight = 295;    
    var imgHeight = canvas.height * imgWidth / canvas.width;  
    var heightLeft = imgHeight;  

    const contentDataURL = canvas.toDataURL('image/png')
    var pdf = new jsPDF('p', 'mm', 'a4'),
    pdfConf = {
      pagesplit: false,
      background: '#fff'
    };

    var position = 4;
    pdf.addImage(contentDataURL, 'PNG', 4, position, imgWidth, imgHeight)
    heightLeft -= pageHeight;


     while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 4, position + 14, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
    pdf.setFont("times", "italic")
    pdf.setFontType("normal");
    pdf.setFontSize(28);    
    pdf.save('Orden.pdf'); // Generated PDF   
  });

}


toggle() {
  this.show = !this.show;
  if(this.show){
    this.getListImage();
  }
  
}  



}
