import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MessageService} from 'primeng/api';
import {Message} from 'primeng/api';

// SERVICES
import { OrderserviceService, UserService } from 'src/app/services/service.index';



@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: [
  './delete.component.css'
  ],
  providers: [MessageService]
})

export class DeleteComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  // private services: Service[] = [];
  // private servicetype: ServiceType[] = [];
  category_id: number;
  msgs: Message[] = [];

  constructor(
  // private _route: ActivatedRoute,
  // private _router: Router,        
  private _userService: UserService,
  // private _proyectoService: UserService,  
  public dialogRef: MatDialogRef<DeleteComponent>,      
  private _orderService: OrderserviceService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  // private messageService: MessageService
  
  ) 
  { 
  this.title = "Eliminar Orden N.";
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();  
  }


  ngOnInit() {
    this.category_id = this.data['category_id'];   
   //console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  confirmDelete(): void {
    //console.log(this.data);
    this._orderService.delete(this.token.token, this.data['order_id'], this.category_id);
  }




}