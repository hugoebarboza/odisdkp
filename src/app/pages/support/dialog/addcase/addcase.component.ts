import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FileItem } from 'src/app/models/types';
import { Observable, of, Subject, concat, defer } from 'rxjs';
import { FormGroup, Validators, FormControl} from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map, combineLatest } from 'rxjs/operators';

// FIREBASE
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireUploadTask } from 'angularfire2/storage';


import swal from 'sweetalert';

import { ToastrService } from 'ngx-toastr';

import * as _moment from 'moment';

// MODEL
import { UserFirebase } from '../../../../models/types';

// MOMENT
const moment = _moment;

// SERVICES
import { CargaImagenesService, CdfService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-addcase',
  templateUrl: './addcase.component.html',
  styleUrls: ['./addcase.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})

export class AddcaseComponent implements OnInit {

  identity: any;
  isLoading = false;
  forma: FormGroup;
  userLoading = false;
  userinput = new Subject<string>();
  file: FileItem[] = [];
  archivos: FileItem[] = [];
  ncase: any;
  urgencia: any;
  type: any;    
  selectstatus: {id: any; name: any; label: any};
  token: any;
  userFirebase: UserFirebase;
  arrayResponsables = [];

  public CARPETA_ARCHIVOS = '';

  Url: string;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  supportcase = 'supportcase';
  showlist: boolean = false;

  public departamento$: Observable<any[]>;
  private departamentosCollection: AngularFirestoreCollection<any>;

  public users$: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  public tagImportant$: Observable<any[]>;
  private tagImportantCollection: AngularFirestoreCollection<any>;

  public tipo$: Observable<any[]>;
  private tipoCollection: AngularFirestoreCollection<any>;

  public categoria$: Observable<any[]>;
  private categoriaCollection: AngularFirestoreCollection<any>;

  limitDay = 0;
  day = 0;
  nota = null;
  categoriaPlazo = null;

  public  categoriaDocumentos$: Observable<any[]>;
  private categoriaDocCollection: AngularFirestoreCollection<any>;

  constructor(
    private _afs: AngularFirestore,
    private _cdf: CdfService,
    public _cargaImagenes: CargaImagenesService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddcaseComponent>,
    private firebaseAuth: AngularFireAuth,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.identity = this._userService.getIdentity();
    this.supportcase = this.supportcase + '/' + this.identity.country + '/cases';
    this.token = this._userService.getToken();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });
  }

  ngOnInit() {

    const date = moment(new Date()).format('DD');
    this.day = parseInt(date, 0);    

    this.forma = new FormGroup({
      departamento: new FormControl (null, [Validators.required]),
      tipo: new FormControl ('', [Validators.required]),
      categoria: new FormControl ('', [Validators.required]),
      etiquetado: new FormControl (null),
      asunto: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      descripcion: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      tagImportant: new FormControl ({})
    });

    this.forma.setValue({
      'departamento': '',
      'tipo': '',
      'categoria': '',
      'etiquetado': '',
      'asunto': '',
      'descripcion': '',
      'tagImportant': {}
    });

    this.getRouteFirebase();
    this.loadusers();

  }

  public loadusers() {

    this.users$ = concat(
      of(null), // default items
      this.userinput.pipe(
         debounceTime(200),
         distinctUntilChanged(),
         tap(() => this.userLoading = true),
         switchMap(term => this.getListuser(term).pipe(
             catchError(() => of(null)), // empty list on error
             tap(() => this.userLoading = false)
         ))
      )
    );

  }



  public getListuser(term: string) {

    // tslint:disable-next-line:max-line-length
    this.usersCollection = this._afs.collection('users', ref => ref.where('country', 'array-contains', this.identity.country).where('email', '>=', term));
    return this.usersCollection.snapshotChanges().pipe(
              map(actions => {
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return { id, ...data };
                });
              })
            );
  }

  selectChangedepto(value) {

    if (value) {

      if (value.day && value.note && value.day > 0) {
        if (this.day >= value.day) {
          this.nota = value.note;
        }
      } else if (value.day && value.note && value.day === 0) {
        this.nota = value.note;
      } else {
        this.nota = null;
      }

      this.tipo$ = null;
      this.categoria$ = null;
      this.categoriaDocumentos$ = null;
      this.selectstatus  = null;
      this.forma.controls['tipo'].setValue('');
      this.forma.controls['categoria'].setValue('');

      this.tipoCollection = this._afs.collection('supporttype', ref => ref.where('depto_id', '==', value.id).orderBy('name'));
      this.tipo$ = this.tipoCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );

      // arrayResponsables
      this._afs.doc('countries/' + this.identity.country + '/departments/' + value.id).get()
      .subscribe(res => {
        if (res.exists) {
          this.arrayResponsables = [];
          // res.data();
          // console.log(res.data());
          if (res.data().admins && res.data().admins.length > 0) {
            //console.log(res.data().admins);
            this.arrayResponsables = this.getUserResponsables(res.data().admins);
          }
         } else {
          this.categoria$ = null;
          this.categoriaDocumentos$ = null;
          this.selectstatus  = null;
          this.forma.controls['categoria'].setValue('');
          this.arrayResponsables = [];
          console.log('Document does not exist');
         }
      });

    } else {

      this.arrayResponsables = [];
      this.tipo$ = null;
      this.categoria$ = null;
      this.categoriaDocumentos$ = null;
      this.selectstatus = null;
      this.forma.controls['tipo'].setValue('');
      this.forma.controls['categoria'].setValue('');
    }

  }


  getUserResponsables(to): Array<any> {

    const arr: any = [];
    for (let ii = 0; ii < to.length; ii++) {

      this._afs.doc('users/' + to[ii]).get()
      .subscribe(res => {
        if (res.exists) {
          //console.log(res.data());
          arr.push(res.data());
         }
      });
    }
    return arr;
  }


  selectChangetype(value) {

    if (value) {
      this.categoriaDocumentos$ = null;
      this.categoria$ = null;
      this.categoriaPlazo = null;
      this.forma.controls['categoria'].setValue('');

      this.categoriaCollection = this._afs.collection('supportcategory', ref => ref.where('type_id', '==', value.id).orderBy('name'));
      this.categoria$ = this.categoriaCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );


      this._afs.collection('supportstatus' , ref => ref.where('stype_id', '==', value.id).orderBy('order_by', 'asc').limit(1))
      .get()
      .subscribe((data: any) => { if (data.size > 0) {
          data.forEach((doc) => {
            const estatus = doc.data();
            estatus.id = doc.id;
            this.selectstatus = estatus;
              }
            );
          }
        }
      );
    } else {
      this.categoria$ = null;
      this.categoriaDocumentos$ = null;
      this.categoriaPlazo = null;
      this.selectstatus = null;
      this.forma.controls['categoria'].setValue('');
    }


  }

  startUpload(event) {

    const filevalidation = event.target.files;

    if (filevalidation && filevalidation.length > 0 && filevalidation.length <= 3) {
    } else {

      this.archivos = [];

      if (filevalidation && filevalidation.length > 3) {
        this.toasterService.warning('Error: Supero limite de 3 archivos', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
      }

    }

  }

  selectChangeCategoria(value) {

    if (value && value.plazo) {
      this.categoriaPlazo = value.plazo;
    } else {
      this.categoriaPlazo = null;
    }

    this.categoriaDocCollection = this._afs.collection('supportcategory/' + value.id + '/documentos', ref => ref.orderBy('name'));
      this.categoriaDocumentos$ = this.categoriaDocCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );

  }  

  removeFile(index: number): void {

    if (index >= 0) {
      this.archivos.splice(index, 1);
    }
    if (this.archivos.length === 0) {
      this.archivos = [];
    }

  }

  getRouteFirebase() {

    this.departamentosCollection = this._afs.collection('countries/' + this.identity.country + '/departments', ref => ref.orderBy('name', 'asc'));
    this.departamento$ = this.departamentosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    const that = this;
    // tslint:disable-next-line:max-line-length
    this.tagImportantCollection = this._afs.collection('supportImportant/' + this.identity.country + '/tag', ref => ref.orderBy('order_by', 'asc'));
    this.tagImportant$ = this.tagImportantCollection.snapshotChanges().pipe(
      map(actions => {
        let count = 1;
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          if (count === 1 ) {
            this.forma.controls.tagImportant.setValue({ id, ...data });
          }
          count = count + 1;
          return { id, ...data };
        });
      })
    );

  }

  generatorcasenumber() {
    const random = Math.floor((Math.random() * 100) + 1);
    return moment(new Date()).format('YYYYMMDDHHmmss') + '' + random;
  }

  confirmAdd() {

    const numbercase = this.generatorcasenumber();
    this.ncase = numbercase;
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.CARPETA_ARCHIVOS = this.supportcase;

    if (this.forma.invalid) {
      swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const array_users: [] = this.forma.value.etiquetado;
    const array_usersNew: Array<Object> = [];
    const array_usersInfo = [];

    for (let ii = 0; ii < array_users.length; ii++) {
      // const obj: Object = {id: array_users[ii]['id']}; // , email: array_users[ii]['email']
      array_usersNew.push(array_users[ii]['id']);
      array_usersInfo.push(array_users[ii]);
    }


    let important = '';
    let important_id = '';

    if (this.forma.value.tagImportant) {
      important = this.forma.value.tagImportant.name;
      important_id = this.forma.value.tagImportant.id;
      this.urgencia = this.forma.value.tagImportant.name;
    }

    const that = this;

    const indexasunto = this.forma.value.asunto.toLowerCase();

    this._afs.collection(this.supportcase).add({
      ncase: parseInt(numbercase, 0),
      asunto: this.forma.value.asunto,
      description: this.forma.value.descripcion,
      create_to: this.userFirebase.uid,
      create_at: date,
      update_at: date,
      depto_id: this.forma.value.departamento.id,
      depto_desc: this.forma.value.departamento.name,
      type_id: this.forma.value.tipo.id,
      type_desc: this.forma.value.tipo.name,
      status_id: this.selectstatus.id,
      status_desc: this.selectstatus.name,
      label: this.selectstatus.label,
      category_id: this.forma.value.categoria.id,
      category_desc: this.forma.value.categoria.name,
      important: important,
      important_id: important_id,
      etiquetados: array_usersNew,
      asuntoIndex: indexasunto.split(' ')
    })
    .then(function(docRef) {
        // console.log('Document written with ID: ', docRef.id);

        if (that.archivos.length > 0) {
          that.toasterService.success('Solicitud registrada, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
          that.CARPETA_ARCHIVOS =  that.CARPETA_ARCHIVOS + '/' + docRef.id + '/caseFiles';
          that._cargaImagenes.cargarImagenesFirebase( that.archivos,  that.CARPETA_ARCHIVOS, date);
          //that.forma.reset();
          that.tipo$ = null;
          that.categoria$ = null;
          that.selectstatus = null;
        }

        that.onNoClick();
        swal('Solicitud registrada', '', 'success');

        if (array_usersInfo && array_usersInfo.length > 0 && docRef) {
          array_usersInfo.forEach(res => {
            that.sendCdfTag(res, docRef, 'Etiquetado(a) en');
          });
        }

        if(that.arrayResponsables && that.arrayResponsables.length > 0 && docRef){
          that.arrayResponsables.forEach(res => {
            that.sendCdfTag(res, docRef, 'Nueva solicitud');
          });
        }

        if(that.userFirebase && docRef){
          //console.log(that.userFirebase);
          that.sendCdfUser(that.userFirebase, docRef, 'Nueva solicitud');
        }

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }




  sendCdfTag(data, element, content) {
    if (!data) {
      return;
    }

    // console.log(data);

    // tslint:disable-next-line:max-line-length
    const body = content + '. El número de solicitud es #' + this.ncase + '. Asunto: ' + this.forma.value.asunto + ', con Descripción: ' + this.forma.value.descripcion + ' y Prioridad: ' + this.urgencia;
    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    if (data && this.userFirebase.uid) {

        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: data.uid,
          title: 'Nueva solicitud',
          message: body,
          create_at: created,
          status: '1',
          idUx: element.id,
          descriptionidUx: 'cases',
          routeidUx: `${this.supportcase}`
        };

        this._cdf.fcmsend(this.token.token, notification).subscribe(
          response => {
            if (!response) {
            return false;
            }
            if (response.status === 200) {
              // console.log(response);
            }
          },
            error => {
            console.log(<any>error);
            }
          );



          this._cdf.httpEmailToSupport(this.token.token, data.email, this.userFirebase.email, 'OCA GLOBAL - Nueva solicitud #' + this.ncase, created, body).subscribe(
            response => {
              if (!response) {
              return false;
              }
              if (response.status === 200) {
                // console.log(response);
              }
            },
              error => {
              // console.log(<any>error);
              }
            );

            
          /*
          const msg = {
            toEmail: data.email,
            fromTo: this.userFirebase.email,
            subject: 'OCA GLOBAL - Nueva solicitud #' + this.ncase,
            message: `
            <!DOCTYPE html>
            <html>
            <head>
            <style >
            </style>
            </head>
            <body>
    
            <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F9F9F9">
            <tbody>
              <tr>
              <td align="center">
              <table width="640" cellpadding="0" cellspacing="0" >
                <tbody>
                <tr>
                <td><p></p></td>
                </tr>                        
    
                <tr>
                  <td>
                  <table border="0" cellspacing="0" cellpadding="0" width="100%"  style="border-collapse:collapse;background:#fff;border:1px solid #ededed" bgcolor="#fff">
                  <tbody>
                    <tr>
                    <td>
                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
    
                      <tbody>
                        <tr>
                          <td  style="border-bottom-width:1px;padding:12px 0px 12px 24px;background-color: #0b3357;">
                          <div  style="font-size:0pt;line-height:0pt;background-color: #0b3357;" align="left">
                          <a href="https://ocaglobal.com" style="color:#45abd9;text-decoration:none" target="_blank">
                          <img alt="" src="https://ocaglobal.com/themes/ledel-foundation6-october/assets/img/logo.svg" style="width:130px;border:0px solid" >
                          </a>
                          </div>
                          </td>
                        </tr>                                            
                      <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
                        <div style="margin-top:25px">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                          <tbody>
                            <tr>    
                            <td width="100%" style="padding:15px 0;border-top:1px dotted #c5c5c5">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed" role="presentation">
                              <tbody>
                              <tr>
                              <td valign="top" style="padding:0 15px 0 15px;width:40px">
                              <img width="40" height="40" alt="" style="height:auto;line-height:100%;outline:none;text-decoration:none;border-radius:5px;" src="https://ci3.googleusercontent.com/proxy/xGsxYfjTvh6KWP4Lx7W_FDfJ5hrmw5YzNi8mji33NvpeZVLJrbcGzQpCDmHxN6OjhGSNobgFjJ4rnYnBGcU1xaIo5cH_JaOEOuPmGSQJNL_HVBWOXal0C2cKf1u_LS6tFrb6JJqHLX52AuZJnnGA5AyLgYDocA5vccvWTdiXZZVM07oRqBesIqndZxnmxx7e1ToFhvl1fEliLx35oWxK2-TVk8jFBCcwAG-CjQn9nbyx5EEF=s0-d-e1-ft#https://secure.gravatar.com/avatar/f375267e4ec6266af88de6e4e70accfc?size=40&amp;default=https%3A%2F%2Fassets.zendesk.com%2Fimages%2F2016%2Fdefault-avatar-80.png&amp;r=g" >
                              </td>
                              <td width="100%" style="padding:0;margin:0" valign="top">
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:15px;line-height:18px;margin-bottom:0;margin-top:0;padding:0;color:#1b1d1e;margin-left:2px;">
                                <strong>${this.userFirebase.email}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
                                </div>                                  
                              </td>        
                              </tr>      
                              </tbody>
                            </table>    
                            </td>  
                            </tr>
                          </tbody>
                          </table>
                        </div>
                        </h2>                                              
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    </td>
                  </tr>
                  </tbody>
                </table>
                </td>
              </tr>           
              </tbody>
              </table>
              </td>
            </tr>
            <tr>
            <td><p></p></td>
            </tr>
            </tbody>
            </table>            
            </body>
            </html>
            `,

          };*/



    }

  }


  sendCdfUser(data, element, content) {
    if (!data) {
      return;
    }

    // console.log(data);

    // tslint:disable-next-line:max-line-length
    const body = 'El número de solicitud es #' + this.ncase + '. Asunto: ' + this.forma.value.asunto + ', con Descripción: ' + this.forma.value.descripcion + ' y Prioridad: ' + this.urgencia;
    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    if (data && this.userFirebase.uid) {
        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: this.userFirebase.uid,
          title: 'Nueva solicitud',
          message: body,
          create_at: created,
          status: '1',
          idUx: element.id,
          descriptionidUx: 'cases',
          routeidUx: `${this.supportcase}`
        };

        this._cdf.fcmsend(this.token.token, notification).subscribe(
          response => {
            if (!response) {
            return false;
            }
            if (response.status === 200) {
              // console.log(response);
            }
          },
            error => {
            console.log(<any>error);
            }
          );


          this._cdf.httpEmailFromOrigin(this.token.token, this.userFirebase.email, this.userFirebase.email, 'OCA GLOBAL - Nueva solicitud #' + this.ncase, created, body).subscribe(
            response => {
              if (!response) {
              return false;
              }
              if (response.status === 200) {
                // console.log(response);
              }
            },
              error => {
              // console.log(<any>error);
              }
            );

          /*
          const msg = {
            toEmail: this.userFirebase.email,
            fromTo: this.userFirebase.email,
            subject: 'OCA GLOBAL - Nueva solicitud #' + this.ncase,
            message: `
            <!DOCTYPE html>
            <html>
            <head>
            <style >
            </style>
            </head>
            <body>
    
            <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F9F9F9">
            <tbody>
              <tr>
              <td align="center">
              <table width="640" cellpadding="0" cellspacing="0" >
                <tbody>
                <tr>
                <td><p></p></td>
                </tr>                        
    
                <tr>
                  <td>
                  <table border="0" cellspacing="0" cellpadding="0" width="100%"  style="border-collapse:collapse;background:#fff;border:1px solid #ededed" bgcolor="#fff">
                  <tbody>
                    <tr>
                    <td>
                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
    
                      <tbody>
                        <tr>
                          <td  style="border-bottom-width:1px;padding:12px 0px 12px 24px;background-color: #0b3357;">
                          <div  style="font-size:0pt;line-height:0pt;background-color: #0b3357;" align="left">
                          <a href="https://ocaglobal.com" style="color:#45abd9;text-decoration:none" target="_blank">
                          <img alt="" src="https://ocaglobal.com/themes/ledel-foundation6-october/assets/img/logo.svg" style="width:130px;border:0px solid" >
                          </a>
                          </div>
                          </td>
                        </tr>                                            
                      <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
                        <p>Gracias por contactar al equipo de soporte de OCA GLOBAL.</p>
                        <p>Hemos recibido su solicitud y estamos trabajando para resolverla. Le ayudaremos tan pronto como podamos.</p>
                        <p></p>
                        <p>Para verificar el estado de la solicitud y agregar comentarios adicionales, siga el enlace aquí
                          <a href="https://odisdkp.firebaseapp.com/#/support" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://support.sendgrid.com/hc/requests/2306369&amp;source=gmail&amp;ust=1561827470902000&amp;usg=AFQjCNHthhPllbak25dNtf46FraBxDF9uQ">odisdkp.firebaseapp.com/#/support</a>.</p>
                          <p>Saludos cordiales!</p>
                          <p></p>
                        <div style="margin-top:25px">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                          <tbody>
                            <tr>    
                            <td width="100%" style="padding:15px 0;border-top:1px dotted #c5c5c5">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed" role="presentation">
                              <tbody>
                              <tr>
                              <td valign="top" style="padding:0 15px 0 15px;width:40px">
                              <img width="40" height="40" alt="" style="height:auto;line-height:100%;outline:none;text-decoration:none;border-radius:5px;" src="https://ci3.googleusercontent.com/proxy/xGsxYfjTvh6KWP4Lx7W_FDfJ5hrmw5YzNi8mji33NvpeZVLJrbcGzQpCDmHxN6OjhGSNobgFjJ4rnYnBGcU1xaIo5cH_JaOEOuPmGSQJNL_HVBWOXal0C2cKf1u_LS6tFrb6JJqHLX52AuZJnnGA5AyLgYDocA5vccvWTdiXZZVM07oRqBesIqndZxnmxx7e1ToFhvl1fEliLx35oWxK2-TVk8jFBCcwAG-CjQn9nbyx5EEF=s0-d-e1-ft#https://secure.gravatar.com/avatar/f375267e4ec6266af88de6e4e70accfc?size=40&amp;default=https%3A%2F%2Fassets.zendesk.com%2Fimages%2F2016%2Fdefault-avatar-80.png&amp;r=g" >
                              </td>
                              <td width="100%" style="padding:0;margin:0" valign="top">
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:15px;line-height:18px;margin-bottom:0;margin-top:0;padding:0;color:#1b1d1e;margin-left:2px;">
                                <strong>${this.userFirebase.email}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
                                </div>                                  
                              </td>        
                              </tr>      
                              </tbody>
                            </table>    
                            </td>  
                            </tr>
                          </tbody>
                          </table>
                        </div>
                        </h2>                                              
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    </td>
                  </tr>
                  </tbody>
                </table>
                </td>
              </tr>           
              </tbody>
              </table>
              </td>
            </tr>
            <tr>
            <td><p></p></td>
            </tr>
            </tbody>
            </table>            
            </body>
            </html>
            `,            
          };*/


    }

  }  

}

export const docJoin = (
  afs: AngularFirestore,
  paths: { [key: string]: string },
  type: number,
  where: string,
  condition,
  nameObject
) => {
  return source =>
    defer(() => {
      let parent;
      const keys = Object.keys(paths);
      let _id = '';

      return source.pipe(
        switchMap(data => {
          // Save the parent data state
          parent = data;
          // Map each path to an Observable
          const docs$ = keys.map(k => {
            const fullPath = `${paths[k]}/${parent[k]}`;
            _id = parent[k];

            if (type === 0 || type === 2) {
              return afs.doc(fullPath).valueChanges();
            }

            if (type === 1) {
              // tslint:disable-next-line:max-line-length
              return afs.collection(`${paths[k]}`, ref => ref.where( where, condition, `${parent[k]}`)).snapshotChanges().pipe(
                map(actions => {
                  return actions.map(a => {
                    const datos = a.payload.doc.data();
                    const _iddoc = a.payload.doc.id;
                    return { _iddoc, ...datos };
                  });
                })
                );
            }

          });

          // return combineLatest, it waits for all reads to finish
          return combineLatest(docs$);
        }),
        map(arr => {

          // We now have all the associated douments
          // Reduce them to a single object based on the parent's keys
          const joins = keys.reduce((acc, cur, idx) => {
            if (type === 0) {
              arr[idx] = Object.assign(arr[idx], {'_id': _id});
            }
            // cur nombre valor entrada que tiene ID
            return { ...acc, [nameObject]: arr[idx] };

          }, {});

          // Return the parent doc with the joined objects
          return { ...parent, ...joins };
        })
      );
    });
};
