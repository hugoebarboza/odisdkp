import { Action } from '@ngrx/store';

export const LOGIN = '[Contador] Login';
export const RESET = '[Contador] Reset';

export class LoginAction implements Action {
    readonly type = LOGIN;
    constructor( public payload: object ) { }
}

export class ResetAction implements Action {
    readonly type = RESET;
}

export type actions = LoginAction |
                      ResetAction ;
