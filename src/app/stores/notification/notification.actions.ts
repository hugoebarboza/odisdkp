import { Action } from '@ngrx/store';

export const SET_NOTIFICATION = '[Notification] Set Notification action';
export const RESET_NOTIFICATION = '[Notification] Reset Notification action';


export class SetNotificationAction implements Action {
    readonly type = SET_NOTIFICATION;
    constructor( public notification: object ) {}
  }
  
  export class ResetNotificationAction implements Action{
    readonly type = RESET_NOTIFICATION;
  }


export type acciones = SetNotificationAction | ResetNotificationAction;
