import { Component, Inject, OnInit, OnDestroy  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';


//SERVICES
import { OrderserviceService, UserService } from '../../../services/service.index';


//MODELS
import {
  AtributoFirma,
  Order,
  OrderAtributoFirma,
  User
 } from '../../../models/types';


//PDF
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';  
//import 'jspdf-autotable';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})



export class ShowComponent implements OnInit, OnDestroy {

	public title: string;
  public identity: any;
  public order: Order[] = [];
  public token: any;

  audioRows = [];
  atributo= new Array();  
  atributofirma: AtributoFirma[] = [];
  counter:number = 0;
  count = 0;
  dataColumns = new Array();
  displayedColumns: string[] = ['id', 'valor'];
  imageToShow = new Array();
  imageRows = new Array();
  isImageLoading: boolean = false;
  isAudioLoading: boolean = false;
  loading: boolean;
  listaudio = [];
  listimageorder = new Array();
  listfirmaimageorder = new Array();
  listfirmauser = new Array();
  orderatributo= new Array();
  orderatributofirma: OrderAtributoFirma[] = [];
  rotationAmount:number = 0;
  show:boolean = false;
  sign:boolean = false;
  showaudio:boolean = false;
  usercreate:User[];
  userupdate:User[];
  
  atributofirmauser = [
    {index: '0', descripcion: 'Firma Informador'},
    {index: '1', descripcion: 'Firma Editor'}
  ];

  margins = {
   top: 70,
   bottom: 40,
   left: 30,
   width: 550
  };

  subscription: Subscription;

  constructor(
    private _userService: UserService,        
    private _orderService: OrderserviceService,
  	public dialogRef: MatDialogRef<ShowComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any
  	) 
  { 

  	this.title = "Ver Orden";
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
  }


  ngOnInit() {
    //console.log(this.data);
    if(this.data.order_id > 0){
      this.loadData();
    }
    
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }



  public loadData(){
      if(!this.token.token){
        return;
      }
      this.loading = true;
      this.order = null; 
      this.subscription = this._orderService.getShowOrderService(this.token.token, this.data['service_id'], this.data['order_id']).subscribe(
      response => {
      if(!response){
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
                  this.getFirmaUser(this.usercreate);
                }
                if(this.order[0].userupdate_id && this.order[0].userupdate_id >0 ){
                  this.userupdate = this.order[0].userupdate_id; 
                  this.getFirmaUser(this.userupdate);
                }
              }
              if(this.order[0].orderatributofirma.length > 0){
                this.orderatributofirma = this.order[0].orderatributofirma;
                this.getFirmaImage(this.orderatributofirma);
              }
              if(this.order[0].atributo_firma.length > 0){
                this.atributofirma = this.order[0].atributo_firma;
              }
                this.loading = false;
          } else{        
                this.loading = false;
          }
      }
      );      
   }


  rotateImage(direction, image) {
    this.rotationAmount += direction == 'left' ? -45 : 45;    
    document.getElementById(image).style.transform = `rotate(${this.rotationAmount}deg)`;
  }

  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  public getFirmaUser(id: any){
    this.subscription = this._userService.getFirmaUser(this.token.token, id).subscribe(
      response => {        
        if(!response){
          return;        
        }
          if(response.status == 'success'){ 
            this.listfirmauser.push(response.datos);
            if(this.listfirmauser){
              //console.log(this.listfirmauser);
              //console.log(this.listfirmauser.length);
            }

          }
      },
          error => {
          console.log(<any>error);
          }   
      );      
  }


  public getFirmaImage(datafirma: any){
    this.subscription = this._orderService.getFirmaImageOrder(this.token.token, this.data['order_id']).subscribe(
      response => {        
        if(!response){
          return;        
        }
          if(response.status == 'success'){ 
            this.listfirmaimageorder = response.datos;
            if(this.listfirmaimageorder.length>0){
              //console.log(this.listfirmaimageorder);
            }

          }
      },
          error => {
          console.log(<any>error);
          }   
      );
  }

  public getListAudio(){

    if(!this.data.order_id || this.data.order_id <= 0){
      return;
    }

    this.isAudioLoading = true;
    this.subscription = this._orderService.getListAudioOrder(this.token.token, this.data.order_id).subscribe(
    response => {
        if(!response){
          this.isAudioLoading = false;
          return;        
        }
        if(response.status == 'success'){ 
          //console.log(response);
          this.listaudio = response.datos;
          if(this.listaudio.length > 0){
            this.audioRows = this.getSplitArray(this.listaudio, 2);
            //console.log(this.audioRows);
          }
          this.isAudioLoading = false;
        }
    },
        error => {
        this.isAudioLoading = false;
        console.log(<any>error);
        }
    );
  }



  public getListImage(){     
      if(!this.data.order_id || this.data.order_id <= 0){
        return;
      }

      this.isImageLoading = true;
      this.subscription = this._orderService.getListImageOrder(this.token.token, this.data['order_id']).subscribe(
      response => {        
        if(!response){
          this.isImageLoading = false;
          return;        
        }
          if(response.status == 'success'){ 
            this.listimageorder = response.datos;
            if(this.listimageorder.length>0){
              this.imageRows = this.getSplitArray(this.listimageorder, 2);
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
        return rowsArray;
        //this.imageRows = rowsArray
        
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
    if(this.show){
      this.getListImage();
    }    
  }  

  toggleaudio() {
    this.showaudio = !this.showaudio;
    if(this.showaudio){
      this.getListAudio();
    }    
  }  


}


