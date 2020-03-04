import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { shareReplay, tap } from 'rxjs/operators';
// import { HttpHeaders, HttpClient } from '@angular/common/http';
// import { startWith, map } from 'rxjs/operators';

// SERVICES
import { OrderserviceService, UserService, CustomerService } from 'src/app/services/service.index';

// import { GLOBAL } from 'src/app/services/global';

// MODELS
import {
  AtributoFirma,
  Order,
  OrderAtributoFirma,
  User
 } from 'src/app/models/types';


// PDF
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// const CACHE_KEY = 'httpCache';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})



export class ShowComponent implements OnInit, OnDestroy {

  title: string;
  identity: any;
  order: Order[] = [];
  show = false;
  showaudio = false;
  sign = false;
  token: any;

  audioRows = [];
  atributo = [];
  atributofirma: AtributoFirma[] = [];
  counter;
  count = 0;
  dataColumns = new Array();
  displayedColumns: string[] = ['id', 'valor'];
  imageToShow = new Array();
  imageRows = new Array();
  isImageLoading = false;
  isAudioLoading = false;
  isRateLimitReached: boolean;
  listaudio = [];
  loading: boolean;
  listimageorder = new Array();
  listfirmaimageorder = new Array();
  listfirmauser = new Array();
  orderatributo = new Array();
  orderatributofirma: OrderAtributoFirma[] = [];
  response: any;
  rotationAmount = 0;
  usercreate: User[];
  userupdate: User[];
  url: any;

  project_id = 0;
  clientInfo: object;
  client_loading = false;

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
    // public _http: HttpClient,
    private _userService: UserService,
    private _orderService: OrderserviceService,
    private _customerService: CustomerService,
    public dialogRef: MatDialogRef<ShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    // this.url = GLOBAL.url;
    this.title = 'Ver Orden';
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
  }


  async ngOnInit() {

    if (!this.data && !this.data['service_id'] && !this.data['order_id']) {
      return;
    }

    if (this.token.token != null && this.data && this.data['service_id'] && this.data['order_id']) {
       this.response = await this.loadData();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  public getData(response: any) {
    if (response) {
          if (response.status === 'success' && response.datos) {
            this.order = response.datos;
            if (this.order.length > 0)  {

                  this.project_id = response.datos[0]['project_id'];
                  this.atributo = response.atributo;
                  this.orderatributo = response.orderatributo;
                  if (this.order[0].sign && this.order[0].sign > 0) {
                    this.sign = true;
                    if (this.order[0].usercreate_id && this.order[0].usercreate_id > 0 ) {
                      this.usercreate = this.order[0].usercreate_id;
                      this.getFirmaUser(this.usercreate);
                    }
                    if (this.order[0].userupdate_id && this.order[0].userupdate_id > 0 ) {
                      this.userupdate = this.order[0].userupdate_id;
                      this.getFirmaUser(this.userupdate);
                    }
                  }
                  if (this.order[0].orderatributofirma.length > 0) {
                    this.orderatributofirma = this.order[0].orderatributofirma;
                    this.getFirmaImage(this.orderatributofirma);
                  }
                  if (this.order[0].atributo_firma.length > 0) {
                    this.atributofirma = this.order[0].atributo_firma;
                  }
                    this.loading = false;
                    this.isRateLimitReached = false;
              } else {
                    this.loading = false;
                    this.isRateLimitReached = false;
              }
          }
    } else {
      return;
    }
  }

  moreClient(cc_id: number) {

    if (this.clientInfo == null) {
      this.client_loading = true;

      if (this.project_id > 0) {
        this._customerService.getProjectCustomerDetail(this.token.token, this.project_id, cc_id).subscribe(
          response => {
            if (response.status === 'success') {
              const customer: any = response.datos;


                  for (let i = 0; i < customer.length; i++) {
                     if (customer) {
                       this.clientInfo = {
                        name_table: customer[i]['name_table'],
                        cc_number: customer[i]['cc_number'],
                        nombrecc: customer[i]['nombrecc'],
                        ruta: customer[i]['ruta'],
                        calle: customer[i]['calle'],
                        numero: customer[i]['numero'],
                        block: customer[i]['block'],
                        depto: customer[i]['depto'],
                        latitud: customer[i]['latitud'],
                        longitud: customer[i]['longitud'],
                        medidor: customer[i]['medidor'],
                        modelo_medidor: customer[i]['modelo_medidor'],
                        id_tarifa: customer[i]['id_tarifa'],
                        id_constante: customer[i]['id_constante'],
                        id_giro: customer[i]['id_giro'],
                        id_sector: customer[i]['id_sector'],
                        id_zona: customer[i]['id_zona'],
                        id_mercado: customer[i]['id_mercado'],
                        tarifa: customer[i]['tarifa'],
                        constante: customer[i]['constante'],
                        giro: customer[i]['giro'],
                        sector: customer[i]['sector'],
                        zona: customer[i]['zona'],
                        mercado: customer[i]['mercado'],
                        id_region: customer[i]['id_region'],
                        id_provincia: customer[i]['id_provincia'],
                        id_comuna: customer[i]['id_comuna'],
                        region: customer[i]['region'],
                        provincia: customer[i]['province'],
                        comuna: customer[i]['comuna'],
                        observacion: customer[i]['observacion'],
                        marca_id: customer[i]['marca_id'],
                        modelo_id: customer[i]['modelo_id'],
                        description: customer[i]['description'],
                        color_id: customer[i]['color_id'],
                        marca: customer[i]['marca'],
                        modelo: customer[i]['modelo'],
                        color: customer[i]['color'],
                        patio: customer[i]['patio'],
                        espiga: customer[i]['espiga'],
                        posicion: customer[i]['posicion'],
                        set: customer[i]['set'],
                        alimentador: customer[i]['alimentador'],
                        sed: customer[i]['sed'],
                        llave_circuito: customer[i]['llave_circuito'],
                        fase: customer[i]['fase'],
                        clavelectura: customer[i]['clavelectura'],
                        factor: customer[i]['factor'],
                        fecha_ultima_lectura: customer[i]['fecha_ultima_lectura'],
                        fecha_ultima_deteccion: customer[i]['fecha_ultima_deteccion'],
                        falta_ultimo_cnr: customer[i]['falta_ultimo_cnr'],
                       };

                       // console.log(this.clientInfo);

                       this.client_loading = false;
                       break;
                     }
                  }

             } else {
              if (response.status === 'error') {
                this.client_loading = false;
                // console.log(response);
              }
            }
          },
              error => {
                this.client_loading = false;
                console.log(<any>error);
              }
          );
        }

    } else {
      this.clientInfo = null;
    }
  }

/*
  public getData(response: any) {
    if (response) {
        response.subscribe(
          (some: any) => {
            if (some.status === 'success' && some.datos) {
              this.order = some.datos;
              if (this.order.length > 0) {
                    this.atributo = some.atributo;
                    this.orderatributo = some.orderatributo;
                    if (this.order[0].sign && this.order[0].sign > 0) {
                      this.sign = true;
                      if (this.order[0].usercreate_id && this.order[0].usercreate_id > 0 ) {
                        this.usercreate = this.order[0].usercreate_id;
                        this.getFirmaUser(this.usercreate);
                      }
                      if (this.order[0].userupdate_id && this.order[0].userupdate_id > 0 ) {
                        this.userupdate = this.order[0].userupdate_id;
                        this.getFirmaUser(this.userupdate);
                      }
                    }
                    if (this.order[0].orderatributofirma.length > 0) {
                      this.orderatributofirma = this.order[0].orderatributofirma;
                      this.getFirmaImage(this.orderatributofirma);
                    }
                    if (this.order[0].atributo_firma.length > 0) {
                      this.atributofirma = this.order[0].atributo_firma;
                    }
                      this.loading = false;
                } else {
                      this.loading = false;
                }
            }
          },
          (error) => {
            console.log(<any>error);
          });
    } else {
      return;
    }
  }*/


  async loadData() {

      /*
      let resp: any;
      this.loading = true;
      this.order = null;

      const url = this.url + 'service/' + this.data['service_id'] + '/order/' + this.data['order_id'];
      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      resp = this._http.get(url, {headers: headers}).pipe(map(res => res));

      resp.subscribe( (next: any) => {
        localStorage[CACHE_KEY] = JSON.stringify(next);
      });

      resp = resp.pipe(
        startWith(JSON.parse(localStorage[CACHE_KEY] || '[]'))
      );

      return resp;
      */

      return this._orderService.getShowOrderService(this.token.token, this.data['service_id'], this.data['order_id'])
      .pipe(
        tap(),
        shareReplay()
      )
      .subscribe( res => {
        if (!res) {
          return;
        }
        return this.getData(res);
      },
      error => {
        this.loading = false;
        this.isRateLimitReached = true;
        console.log(<any>error);
      }
      );

   }


  rotateImage(direction, image) {
    this.rotationAmount += direction === 'left' ? -45 : 45;
    document.getElementById(image).style.transform = `rotate(${this.rotationAmount}deg)`;
  }

  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  public getFirmaUser(id: any) {
    this.subscription = this._userService.getFirmaUser(this.token.token, id).subscribe(
      response => {
        if (!response) {
          return;
        }
          if (response.status === 'success') {
            this.listfirmauser.push(response.datos);
            if (this.listfirmauser) {
              // console.log(this.listfirmauser);
              // console.log(this.listfirmauser.length);
            }

          }
      },
          error => {
          console.log(<any>error);
          }
      );

}


  public getFirmaImage(_datafirma: any) {
    this.subscription = this._orderService.getFirmaImageOrder(this.token.token, this.data['order_id']).subscribe(
      response => {
        if (!response) {
          return;
        }
          if (response.status === 'success') {
            this.listfirmaimageorder = response.datos;
            if (this.listfirmaimageorder.length > 0) {
              // console.log(this.listfirmaimageorder);
            }

          }
      },
          error => {
          console.log(<any>error);
          }
      );
}


public getListAudio() {

  if (!this.data.order_id || this.data.order_id <= 0) {
    return;
  }

  this.isAudioLoading = true;
  this.subscription = this._orderService.getListAudioOrder(this.token.token, this.data.order_id).subscribe(
  response => {
      if (!response) {
        this.isAudioLoading = false;
        return;
      }
      if (response.status === 'success') {
        this.listaudio = response.datos;
        if (this.listaudio.length > 0) {
          this.audioRows = this.getSplitArray(this.listaudio, 2);
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


  public getListImage() {
      this.isImageLoading = true;
      this.subscription = this._orderService.getListImageOrder(this.token.token, this.data['order_id']).subscribe(
      response => {
        if (!response) {
          this.isImageLoading = false;
          return;
        }
          if (response.status === 'success') {
            this.listimageorder = response.datos;
            if (this.listimageorder.length > 0) {
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
     const array = list;
     if (array.length <= columns) {
       array.length = 2;
     }

        const rowsNum = Math.ceil(array.length / columns);
        const rowsArray = new Array(rowsNum);

        for (let i = 0; i < rowsNum; i++) {
            const columnsArray = new Array(columns);
            for (let j = 0; j < columns; j++) {
                const index = i * columns + j;
                if (index < array.length) {
                    columnsArray[j] = array[index];
                } else {
                    break;
                }
            }
            rowsArray[i] = columnsArray;
        }

        return rowsArray;
    }



  public print(divName: any) {
    const innerContents = document.getElementById(divName).innerHTML;
    const popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    // popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="./show.component.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
  }





  public downloadPDF(divName: any) {

/*
 var doc = new jsPDF();
    doc.text("From HTML", 14, 16);
    var elem = document.getElementById("basic-table");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {startY: 20});
    doc.save('Ordenes.pdf');
*/



// OUR IMPLEMENTATION
   const data = document.getElementById(divName);
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 201;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      // var pdf = new jsPDF('p', 'pt', 'letter')
      // var pdf = new jsPDF('p', 'mm', 'letter'); // A4 size page of PDF
      // var pdf = new jsPDF();
      const pdf = new jsPDF('p', 'mm', 'a4');
      // pdfConf = { pagesplit: false, background: '#fff' };

      let position = 4;
          // doc.addImage(imgData, 'JPEG', 15, 40, 180, 180);
      pdf.addImage(contentDataURL, 'PNG', 4, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;


       while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(contentDataURL, 'PNG', 4, position + 14, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
      // pdf.autoPrint()
      pdf.setFont('times', 'italic');
      pdf.setFontType('normal');
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
    if (this.show) {
      this.getListImage();
    }
  }

  toggleaudio() {
    this.showaudio = !this.showaudio;
    if (this.showaudio) {
      this.getListAudio();
    }
  }





}


