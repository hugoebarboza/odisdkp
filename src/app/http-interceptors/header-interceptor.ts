
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

// SERVICES
import { UserService } from '../services/service.index';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  token: any;
  constructor(
    public _userService: UserService,
  ) {
    this.token = this._userService.getToken();
  }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		const authToken = this.token.token;
		const authReq = req.clone({
			headers: new HttpHeaders({
				'Content-Type':  'application/x-www-form-urlencoded',
				'Authorization': authToken
			})
		});
	
		//console.log('Intercepted HTTP call', authReq);
	
		return next.handle(authReq);
	}

}


