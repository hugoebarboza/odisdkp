import { Injectable } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';


@Injectable()
export class SettingsService {

  ajustes: Ajustes = {
    idtema: 0,
    tema: ''
  };

  constructor(
    private _router: Router,
  ) {
    this.cargarAjustes();
  }

  guardarAjustes() {
    // console.log('Guardado en el localStorage');
    localStorage.setItem('ajustes', JSON.stringify( this.ajustes )  );
  }

  cargarAjustes() {
    if ( localStorage.getItem('ajustes') ) {
      this.ajustes = JSON.parse( localStorage.getItem('ajustes') );
      // console.log( 'Cargando del localstorage' );

      this.aplicarTema( this.ajustes.tema, this.ajustes.idtema );

    } else {
      // console.log( 'Usando valores por defecto' );
      this.aplicarTema( this.ajustes.tema, this.ajustes.idtema );
    }
  }

  aplicarTema( tema, tcolor ) {
    // let url = `assets/css/colors/${ tema }.css`;
    // this._document.getElementById('tema').setAttribute('href', url );

    this.ajustes.tema = tema;
    this.ajustes.idtema = tcolor;
    this.guardarAjustes();
  }

  getDataRoute(): Observable<any> {
    // console.log('paso');
    return this._router.events
        .filter( evento => evento instanceof ActivationEnd  )
        .filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null )
        .map( (evento: ActivationEnd) => evento.snapshot.data );
  }


}

interface Ajustes {
  idtema: number;
  tema: string;
}
