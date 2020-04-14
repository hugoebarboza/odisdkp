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


  async getProject(index: number) {

    if (!index) {
      return;
    }

    if (index) {
      const project = await JSON.parse(localStorage.getItem('proyectos')).find(data => data.id === +index);
      if (project !== 'undefined' && project !== null && project) {
        return project;
      } else {
        this._router.navigateByUrl('/notfound');
      }
    } else {
      this._router.navigateByUrl('/notfound');
    }

  }


}

interface Ajustes {
  idtema: number;
  tema: string;
}
