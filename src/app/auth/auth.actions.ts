import { Action } from '@ngrx/store';

export const SET_USER = '[Auth] Set User';


export class SetUserAction implements Action {
    readonly type = SET_USER;
    constructor( public uid: object ) {}
}


export type acciones = SetUserAction;
