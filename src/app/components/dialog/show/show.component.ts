import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatTableDataSource} from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';


// material
import {MatGridListModule} from '@angular/material/grid-list';


//SERVICES
import { UserService } from '../../../services/user.service';
import { OrderserviceService } from '../../../services/orderservice.service';


//MODELS
import { Order } from '../../../models/order';
import {Column} from '../../../models/columns';

//PDF
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';  
//import 'jspdf-autotable';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})



export class ShowComponent  {
	public title: string;
  public identity;
  public token;
  public order: Order[] = [];
  public show:boolean = false;
  isImageLoading: boolean = false;
  loading: boolean;
  atributo= new Array();  
  orderatributo= new Array();  
  listimageorder = new Array();
  displayedColumns: string[] = ['id', 'valor'];  
  counter;
  count = 0;
  dataColumns = new Array();
  imageToShow = new Array();
  imageRows = new Array();
  
margins = {
  top: 70,
  bottom: 40,
  left: 30,
  width: 550
};


  constructor(
    private _userService: UserService,        
    private _orderService: OrderserviceService,
  	public dialogRef: MatDialogRef<ShowComponent>,
    private sanitizer: DomSanitizer,
	  @Inject(MAT_DIALOG_DATA) public data: any
  	) 
  { 

  	this.title = "Ver Orden N.";
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);


    if(this.token.token != null){
      //console.log(this.data['order_id']);
      //console.log(this.data['service_id']);
       this.loadData();    
       //this.getListImage();
    }    
  }


  public loadData(){
      this.loading = true;
      this.order = null; 
      this._orderService.getShowOrderService(this.token.token, this.data['service_id'], this.data['order_id']).subscribe(
      response => {
      if(!response){
        return;
         }       
          this.order = response.datos;
          //console.log(this.order);
        if(this.order.length > 0){
              this.atributo = response.atributo;
              this.orderatributo = response.orderatributo;
                //console.log(this.orderatributo);
                this.loading = false;
          } else{        
                this.loading = false;
          }
          //console.log(this.servicename);        
      }
      );      
   }


  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }




  public getListImage(){     
      this.isImageLoading = true;
      this._orderService.getListImageOrder(this.token.token, this.data['order_id']).subscribe(
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



  public print(divName) {
    var innerContents = document.getElementById(divName).innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    //popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="./show.component.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
  }





  public downloadPDF(divName){

/*
 var doc = new jsPDF();
    doc.text("From HTML", 14, 16);
    var elem = document.getElementById("basic-table");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {startY: 20});
    doc.save('Ordenes.pdf');       
*/



//OUR IMPLEMENTATION
   var data = document.getElementById(divName);  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 201;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')
      //var pdf = new jsPDF('p', 'pt', 'letter')
      //var pdf = new jsPDF('p', 'mm', 'letter'); // A4 size page of PDF  
      //var pdf = new jsPDF();
      var pdf = new jsPDF('p', 'mm', 'a4'),
      pdfConf = {
        pagesplit: false,
        background: '#fff'
      };

      var position = 4;
          //doc.addImage(imgData, 'JPEG', 15, 40, 180, 180);
      pdf.addImage(contentDataURL, 'PNG', 4, position, imgWidth, imgHeight)
      heightLeft -= pageHeight;


       while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(contentDataURL, 'PNG', 4, position + 14, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
      //pdf.autoPrint()      
      pdf.setFont("times", "italic")
      pdf.setFontType("normal");
      pdf.setFontSize(28);    
      pdf.save('Orden.pdf'); // Generated PDF   
    });
    /*
    const doc = new jsPDF({
        unit: "pt",
        orientation: "p",
        lineHeight: 1.2
      });*/

  }


  toggle() {
    this.show = !this.show;
    this.getListImage();   
  }  


}


