import { ActionReducerMap } from "@ngrx/store";
import { contadorReducer } from "./contador.reducer";
import { authReducer } from './auth/auth.reducer';

export interface AppState {
    objNgrx: any;
    uid: any;
}

export const appReducers: ActionReducerMap<AppState> = {
    objNgrx: contadorReducer,
    uid: authReducer
};
