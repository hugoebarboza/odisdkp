import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

// MODELS
import { User } from 'src/app/models/types';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor(
    private socket: Socket,
  ) {
    this.checkStatus();
    this.cargarStorage();
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado con WsServer');
      this.socketStatus = true;
      this.cargarStorage();
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado con WsServer');
      this.socketStatus = false;
    });
  }

  cargarStorage() {

    if ( localStorage.getItem('identity') ) {
      const usuario: User = JSON.parse( localStorage.getItem('identity') );
      this.loginWS( usuario.email );
    }

  }


  emit(evento: string, payload?: any, callback?: any ) {
    // console.log('emitiendo', evento);
    // emit('EVENTO', payload, callback?)
    this.socket.emit(evento, payload, callback);

  }

  emitirUsuariosActivos() {
    this.emit( 'obtener-usuarios' );
  }

  getUsuariosActivos() {
    return this.listen( 'usuarios-activos' );
  }


  listen(evento: string) {
    return this.socket.fromEvent(evento);
  }

  loginWS( nombre: string ) {

    return new Promise(  (resolve, reject) => {

      if (nombre === '') {
        reject();
      }

      this.emit( 'configurar-usuario', { nombre }, (resp: any) => {

        // console.log(resp);
        // this.usuario = new Usuario( nombre );

        resolve(resp);

      });

    });

  }

  logoutWS() {
    const payload = {
      nombre: 'sin-nombre'
    };

    this.emit('configurar-usuario', payload, () => {});
  }



}
