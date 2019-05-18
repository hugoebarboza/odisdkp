import { Component } from '@angular/core';
import { Router } from '@angular/router';


//SERVICES
import { UserService } from '../../../services/service.index';

import {  AngularFirestore,  AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
export interface Item { id: number; }


//MATERIAL
import { MatDialog } from '@angular/material';


//DIALOG
import { AddSupportComponent } from '../../../components/dialog/widget/addsupport/addsupport.component';
import { LogoutComponent } from '../../../components/dialog/logout/logout.component';

//NGRX REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { ResetAction } from 'src/app/contador.actions';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService]
})

export class HeaderComponent {

	public title: string;
	public titlelogout: string;
  public fotoperfil: string = '';
  public identity: any;
  public isLoading: boolean = true;
	public token: any;
  

  //private itemsCollection: AngularFirestoreCollection<Item>;

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  
	subscription: Subscription;

	constructor(
		private _router: Router,		
		private _userService: UserService,
		public dialog: MatDialog,
    private afs: AngularFirestore,
    private store: Store<AppState>,

   ){
		this.title = 'Header';	  	
		this.titlelogout = '¿ Está seguro de salir ?';	  	
  	this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.fotoperfil = this._userService.getFotoProfile();
    this.itemsCollection = afs.collection<Item>('items');
    this.items = this.itemsCollection.valueChanges();
    this.isLoading = true;
	}
 
	ngOnInit(){
    this.store.select('objNgrx')
    .subscribe( objNgrx  => {
      if (objNgrx) {
        this.identity = objNgrx.identificacion;
      }
      this.identity = this._userService.getIdentity();
      if(this.identity){
        this.isLoading = false;
      }  
    });

    
    if(this.identity){
      this.isLoading = false;
    }
    //this.addTodo(4);
    //console.log(this.itemsCollection);
	  	if (this.identity == null ){
        this._userService.logout();
	  		//this._router.navigate([""]);
	  	}else{
	  		//console.log('header.component cargado'); 				
	  	}

	}

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    if(this.subscription){
      this.subscription.unsubscribe();
    }

  }

  addTodo(iddb: number) {
      this.itemsCollection.add({ id: iddb });
      //console.log('paso');
  }

  
  ngDoCheck(){
    //this.identity = this._userService.getIdentity();
    //this.token = this._userService.getToken();
    this.fotoperfil = this._userService.getFotoProfile();    
  }

  resetAction() {
    const accion = new ResetAction();
    this.store.dispatch( accion );
  }

  support(value:number) {
    const dialogRef = this.dialog.open(AddSupportComponent, {
    width: '777px',     
    disableClose: true,        
    data: { id: value }
    });


    dialogRef.afterClosed().subscribe(
          result => {       
             if (result === 1) { 
             // After dialog is closed we're doing frontend updates 
             // For add we're just pushing a new row inside DataService
             //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
             }
           });
 }  

 
  logout(id:number) {
     const dialogRef = this.dialog.open(LogoutComponent, {
     width: '280px',             
     data: { id: id, title: this.titlelogout }
     });


     dialogRef.afterClosed().subscribe(
           result => {       
              if (result === 1) {
              //this.resetAction();
              // After dialog is closed we're doing frontend updates 
              // For add we're just pushing a new row inside DataService
              //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
              }
            });
  }



}





