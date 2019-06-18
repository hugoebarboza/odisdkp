import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FileItem } from 'src/app/models/types';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    this.mouseSobre.emit( true );
    this._prevenirDetener( event );
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    this.mouseSobre.emit( false );
  }

  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {
    const transferencia = this._getTransferencia( event );
    if ( !transferencia ) {
      return;
    }
    this._extraerArchivos( transferencia.files );
    this._prevenirDetener( event );
    this.mouseSobre.emit( false );
  }

  @HostListener('change', ['$event'])
  public onChange( event: any ) {
    this._extraerArchivos( event.target.files );
  }

  private _getTransferencia( event: any ) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  public _extraerArchivos( archivosLista: FileList ) {

    // tslint:disable-next-line:forin
    for ( const propiedad in Object.getOwnPropertyNames( archivosLista ) ) {
      const archivoTemporal = archivosLista[propiedad];
      //console.log(archivoTemporal);

      /*if (archivoTemporal.type === '') {
        const type = this.extensionsName(archivoTemporal.name);
        let extensions = '';
        if (type[0] === 'docx') {
          extensions = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
        if (type[0] === 'doc') {
          extensions = 'application/msword';
        }
        if (type[0] === 'rar') {
          extensions = 'application/x-rar-compressed';
        }
        if (type[0] === 'xlsx') {
          extensions = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
        if (type[0] === 'xls') {
          extensions = 'application/vnd.ms-excel';
        }

        // archivoTemporal.type = extensions;
       }*/

      if ( this._archivoPuedeSerCargado(archivoTemporal) ) {
        const nuevoArchivo = new FileItem( archivoTemporal );
        this.archivos.push( nuevoArchivo );
      }
    }

  }


  private extensionsName(filename): Array<any> {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
  }

  ////// Validaciones
  private _archivoPuedeSerCargado( archivo: File ): boolean {

    if ( !this._archivoYaFueDroppeado( archivo.name ) && this._esImagen( archivo.type) ) {
      return true;
    } else {
      return false;
    }


  }

  private _prevenirDetener( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDroppeado( nombreArchivo: string ): boolean {

    for ( const archivo of this.archivos ) {

      if ( archivo.nombreArchivo === nombreArchivo  ) {
        console.log('El archivo ' + nombreArchivo + ' ya esta agregado');
        return true;
      }

    }

    return false;
  }

  private _esImagen( tipoArchivo: string ): boolean { 
    console.log(tipoArchivo);
    if ( tipoArchivo === '' || tipoArchivo === undefined ) {
      return false;  
    }

    if(tipoArchivo.startsWith('image')){
      return true;
    }

    if(tipoArchivo.startsWith('application/pdf')){
      return true;
    }

    if(tipoArchivo.startsWith('application/x-rar-compressed')){
      return true;
    }

    if(tipoArchivo.startsWith('application/x-zip-compressed')){
      return true;
    }

    if(tipoArchivo.startsWith('application/vnd.ms-excel')){
      return true;
    }

    if(tipoArchivo.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')){
      return true;
    }

    if(tipoArchivo.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')){
      return true;
    }

    if(tipoArchivo.startsWith('application/x-zip-compressed')){
      return true;
    }

    if(tipoArchivo.startsWith('application/msword')){
      return true;
    }
      
    if(tipoArchivo.startsWith('video')){
      return true;
    }
        
    //return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }


}
