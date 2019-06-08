import * as fromLoader from './loader.actions';

export interface State {
    isLoading: object;
}

const initState: State = {
    isLoading: {}
};


export function loaderReducer( state = initState, action: fromLoader.acciones ) {

    switch ( action.type ) {

        case fromLoader.RESET_LOADER:
            return {
                isLoading: false
            };

        case fromLoader.SET_LOADER:
            return {
                isLoading: true
            };

        default:
            return state;

    }


}

