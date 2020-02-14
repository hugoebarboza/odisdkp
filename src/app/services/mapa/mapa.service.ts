import {
    Injectable
} from '@angular/core';

import {
    Http, URLSearchParams
} from '@angular/http';

import 'rxjs/add/operator/map';

import {
    environment
} from '../../../environments/environment';

import {
    GLOBAL
} from '../global';

@Injectable({
    providedIn: 'root'
})
export class MapaService {
    public urlmap: string;
    public apikey: string;
    error: boolean;

    constructor(
        public _http: Http,
    ) {
        this.urlmap = GLOBAL.urlgooglemaps;
        this.apikey = environment.global.agmapikey;
        this.error = false;
    }

    getDirections(token: any, data: any) {
        if (!token) {
            return;
        }

        const params = new URLSearchParams();
        params.set('origin', data.origin);
        params.set('destination', data.destination);
        params.set('waypoints', data.waypoints);
        params.set('key', this.apikey);

        const origin = data.origin;
        const destination = data.destination;
        const waypoints = data.waypoints;
        // https maps.googleapis.com/maps/api/directions/json?origin=1,1&destination=2,2&waypoints=3,3|4,4|5,5&key=xxx
        const paginate = `/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${this.apikey}`;
        // console.log(paginate);
        return this.getQuery(paginate, params, token);
    }

    getQuery(query: any, params, token) {
        if (!token) {
            return;
        }

        console.log(query);
        const url = this.urlmap;
        // const href = url + query;
        const requestUrl = url;

        return this._http.get(requestUrl, {
            search: params
        }).map((res: any) => {
            // console.log(res.json());
            return res;
        });
    }

    getGoogleDirections(query: string, params, token) {
        if (!token) {
            return;
        }

        const url = this.urlmap;
        // const href = url + query;
        const requestUrl = url;
        // console.log(requestUrl);
        // const headers = new HttpHeaders({'Content-Type': 'application/json'});

        return new Promise((resolve, reject) => {
            if (query === '') {
               reject();
            }

            resolve(this._http.get(requestUrl, {
                search: params
            }));
        })
    }

}