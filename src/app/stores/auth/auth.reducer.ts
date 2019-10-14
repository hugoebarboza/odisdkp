


import * as fromAuth from './auth.actions';


export function authReducer( state: object, action: fromAuth.acciones ) {

    switch ( action.type ) {

        case fromAuth.RESET_USER:
            return null;

        case fromAuth.SET_USER:
            return {
                uid: { ... action.uid }
            };

        default:
            return state;

    }


}

