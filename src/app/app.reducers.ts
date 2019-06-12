import { ActionReducerMap } from "@ngrx/store";
import { authReducer } from './stores/auth/auth.reducer';
import { contadorReducer } from "./contador.reducer";
import { loaderReducer } from './stores/loader/loader.reducer';

export interface AppState {
    objNgrx: any;
    uid: any;
    loading: any;    
}

export const appReducers: ActionReducerMap<AppState> = {
    objNgrx: contadorReducer,
    uid: authReducer,
    loading: loaderReducer,
};
