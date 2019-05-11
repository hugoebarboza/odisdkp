import * as fromContador from './contador.actions';

export function contadorReducer( state: object, action: fromContador.actions ) {

    switch ( action.type ) {

        case fromContador.RESET:
            return null;

        case fromContador.LOGIN:
            return action.payload;

        default:
            return state;

    }
}
