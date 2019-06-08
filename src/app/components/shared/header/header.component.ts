import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';

//FIREBASE
import {  AngularFirestore,  AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';


//MATERIAL
import { MatDialog } from '@angular/material';
import { TooltipPosition } from '@angular/material';

//MODELS
import { User, UserFirebase } from 'src/app/models/types';


//DIALOG
import { AddSupportComponent } from '../../../components/dialog/widget/addsupport/addsupport.component';
import { LogoutComponent } from '../../../components/dialog/logout/logout.component';

//NGRX REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { ResetAction } from 'src/app/contador.actions';
import { SetUserAction } from 'src/app/stores/auth/auth.actions';

//SERVICES
import { UserService } from '../../../services/service.index';



export interface Item { id: number; }


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
  

  notificationsRef: AngularFirestoreCollection<any>;
  notifications$: any;
  getnotifications$: Observable<any>;
  resultCount: number = 0;
  private userSubscription: Subscription = new Subscription();
  private userDoc: AngularFirestoreDocument<User>;
  user$: Observable<User>;
  userid: any;
  uid:any;

  //private itemsCollection: AngularFirestoreCollection<Item>;

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[3]);
  
	subscription: Subscription;

	constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,

		private _userService: UserService,
		public dialog: MatDialog,
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

  /*    
    if(this.identity){
      this.isLoading = false;
    }
    if (this.identity == null ){
      this._userService.logout();
    }else{
    }
*/

    this.afAuth.authState.subscribe((auth: any) => {
    if ( auth ) {

          const newUser = new UserFirebase( auth );

          const accion = new SetUserAction(newUser);
          this.store.dispatch( accion );

          //this.store.dispatch( new SetUserAction( newUser ) );
          //console.log(newUser);

          this.userDoc = this.afs.doc<User>(`/users/${auth.uid}`);
          this.notificationsRef = this.userDoc.collection('notifications', ref => ref.where('status', '==', '1'));
          this.getnotifications$ = this.notificationsRef.snapshotChanges()
          .map(actions => {
            this.isLoading = false;
            this.resultCount = actions.length;
            return actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          });
    } else {
        //this.userSubscription.unsubscribe();
    }
    });

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





