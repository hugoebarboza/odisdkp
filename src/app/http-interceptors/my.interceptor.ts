import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse }
  from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';



@Injectable()
export class MyInterceptor implements HttpInterceptor {
    constructor(
    ) {
    }    

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  let token : string;
  let currentUser : any = JSON.parse(localStorage.getItem('token'));
  if (currentUser){
    token = currentUser.token;
  }else{
    token = ""
  }

  if (token) {
    req = req.clone({ headers: req.headers.set('Authorization',token) });
  }

  if (!req.headers.has('Content-Type')) {
    //req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
  }

    const duplicate = req.clone({ params: req.params.set('filter', 'completed') });
    return next.handle(duplicate);    
    /*
    return next.handle(req).do(evt => {
      if (evt instanceof HttpResponse) {
        console.log('---> statusss:', evt.status);
        console.log('---> filterrrr:', req.params.get('filter'));
      }
    });*/
}


}