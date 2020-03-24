import {Component} from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/service.index';


@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    providers: [UserService]

})
export class DefaultComponent {
   public title: string;

    mostrar = true;

    constructor(

    ) {
      this.title = 'Inicio';
    }

}
