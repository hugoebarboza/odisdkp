import { Action } from '@ngrx/store';

export const SET_USER = '[Auth] Set User';
export const RESET_USER = '[Auth] Reset User';


export class SetUserAction implements Action {
    readonly type = SET_USER;
    constructor( public uid: object ) {}
}

export class ResetUserAction implements Action {
    readonly type = RESET_USER;
}


export type acciones = SetUserAction | ResetUserAction;
