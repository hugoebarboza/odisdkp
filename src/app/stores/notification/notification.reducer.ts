import * as fromNotification from './notification.actions';



export function notificationReducer( state: Object, action: fromNotification.acciones ) {

    switch ( action.type ) {

        case fromNotification.RESET_NOTIFICATION:
            return 0;

        case fromNotification.SET_NOTIFICATION:
            return action.notification

        default:
            return state;

    }


}

