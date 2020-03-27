import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


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
      const usuario = JSON.parse( localStorage.getItem('identity') );
      this.loginWS( usuario );
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

  loginWS( usuario: any ) {

    return new Promise(  (resolve, reject) => {

      if (!usuario) {
        reject();
      }

      this.emit( 'configurar-usuario', { usuario }, (resp: any) => {

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
