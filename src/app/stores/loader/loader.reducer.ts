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
                ...state,
                isLoading: false
            };

        case fromLoader.SET_LOADER:
            return {
                ...state,
                isLoading: true
            };

        default:
            return state;

    }


}

