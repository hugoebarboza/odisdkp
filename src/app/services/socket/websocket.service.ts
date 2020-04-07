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
      // console.log('Desconectado con WsServer');
      this.socketStatus = false;
    });
  }

  cargarStorage() {

    if ( localStorage.getItem('identity') ) {
      const usuario = JSON.parse( localStorage.getItem('identity') );
      if (usuario) {
        this.loginWS( usuario );
      }
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

  emitirUpdateOrder(payload?: any) {
    this.emit( 'update-order', payload );
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

      const nombre = usuario.email;

      this.emit( 'configurar-usuario', { nombre }, (resp: any) => {

        // console.log(resp);
        // this.usuario = new Usuario( nombre );

        resolve(resp);

      });

    });

  }

  logoutWS() {
    /*
    const usuario = {
      name: 'sin-nombre',
      email: 'sin-email',
      role_name: 'sin-role',
      country_code: 'sin-country',
      sala: 'sin-sala',
    };*/

    // console.log(usuario);

    const nombre = 'sin-nombre';

    this.emit('configurar-usuario', { nombre }, () => {});
  }



}
