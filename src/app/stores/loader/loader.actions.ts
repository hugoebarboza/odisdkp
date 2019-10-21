import { Action } from '@ngrx/store';

export const SET_LOADER = '[Loader] Show loader action';
export const RESET_LOADER = '[Loader] Hide loader action';


export class ShowLoaderAction implements Action {
    readonly type = SET_LOADER;
    constructor( public isloading: object ) {}
  }

  export class HideLoaderAction implements Action {
    readonly type = RESET_LOADER;
  }


export type acciones = ShowLoaderAction | HideLoaderAction;
