import { NgModule, ErrorHandler } from '@angular/core';
import { ErrorsHandler } from './providers/error/error-handler';


@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    }
  ]
})
export class ErrorModule {}
