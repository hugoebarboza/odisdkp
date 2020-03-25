import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { defer, combineLatest } from 'rxjs/';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';
import { switchMap, map, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import {  AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

// MATERIAL
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';

// MODELS
import { User, UserFirebase } from 'src/app/models/types';

// DIALOG
import { LogoutComponent } from 'src/app/components/dialog/logout/logout.component';

// NGRX REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { ResetAction } from 'src/app/contador.actions';
import { SetUserAction } from 'src/app/stores/auth/auth.actions';

// SERVICES
import { SidenavService, UserService, WebsocketService } from 'src/app/services/service.index';

export interface Item { id: number; }


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService]
})

export class HeaderComponent implements OnInit, OnDestroy {

  public title: string;
  public titlelogout: string;
  public fotoperfil = '';
  public identity: any;
  public isLoading = true;
  public token: any;
  userid: any;

  getnotifications$: Observable<any>;

  notificationsRef: AngularFirestoreCollection<any>;
  notifications$: any;
  resultCount = 0;

  private userDoc: AngularFirestoreDocument<User>;
  user$: Observable<User>;

  uid: any;

  // private itemsCollection: AngularFirestoreCollection<Item>;

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[3]);

  subscription: Subscription;

  constructor(
    public _userService: UserService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private supportDrawer: SidenavService,
    public wsService: WebsocketService,

   ) {
    this.title = 'Header';
    this.titlelogout = '¿ Está seguro de salir ?';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.fotoperfil = this._userService.getFotoProfile();
    this.itemsCollection = afs.collection<Item>('items');
    this.items = this.itemsCollection.valueChanges();
    this.isLoading = true;
  }

  ngOnInit() {
    this.store.select('objNgrx')
    .subscribe( objNgrx  => {
      if (objNgrx) {
        this.fotoperfil = this._userService.getFotoProfile();
        this.identity = objNgrx.identificacion;
      } else {
        if (this.subscription) {
          this.subscription.unsubscribe();
         }
      }
      this.identity = this._userService.getIdentity();
      if (this.identity) {

        this.isLoading = false;
      }
    });



   this. subscription = this.afAuth.authState.subscribe((auth: any) => {
    if ( auth ) {

          const newUser = new UserFirebase( auth );
          this.userid = auth.uid;
          const accion = new SetUserAction(newUser);
          this.store.dispatch( accion );

          this.userDoc = this.afs.doc<User>(`/users/${this.userid}`);
          this.notificationsRef = this.userDoc.collection('notifications', ref => ref.where('status', '==', '1').orderBy('create_at', 'desc'));
          this.subscription = this.notificationsRef.snapshotChanges()
          .pipe(
            map(actions => {
              this.isLoading = false;
              this.resultCount = actions.length;
              if (this.resultCount === 0) {
                this.notifications$ = null;
              }
              return actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                    return { id, ...data };
              });
            })
          ).subscribe( (collection: any[]) => {
            const count = Object.keys(collection).length;
            if (count === 0) {
              this.notifications$ = null;
            } else {
              this.gojoin(of(collection));
            }
          }
        );

    } else {

    }
    });

  }

  gojoin(collection): Observable<any> {
    return this.notifications$ = collection.pipe(
      leftJoin(this.afs, 'create_by', 'users')
    );

  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  addTodo(iddb: number) {
      this.itemsCollection.add({ id: iddb });
  }


  resetAction() {
    const accion = new ResetAction();
    this.store.dispatch( accion );
  }


  logout(id: number) {
     const dialogRef = this.dialog.open(LogoutComponent, {
     width: '280px',
     data: { id: id, title: this.titlelogout }
     });


     dialogRef.afterClosed().subscribe(
           result => {
              if (result === 1) {
              // this.resetAction();
              // After dialog is closed we're doing frontend updates
              // For add we're just pushing a new row inside DataService
              // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());
              }
            });
  }

  readAllNotifications() {
    const userDoc = this.afs.doc<User>(`/users/${this.userid}`);
    userDoc.collection('notifications',  ref => ref.where('status', '==', '1'))
    .get()
    .subscribe((data: any) => {
        if (data) {
          data.forEach((doc) => {
            if (doc.id) {
              userDoc.collection('notifications').doc(doc.id).update({status : '0'});
            }
            }
          );
        }
      }
    );
  }

  toggleRightSidenav() {
    this.supportDrawer.toggle();
  }



}


export const leftJoin = (
  afs: AngularFirestore,
  field,
  collection,
  // limit = 100
) => {
  return source =>
    defer(() => {
      // Operator state

      let collectionData;

      // Track total num of joined doc reads
      // let totalJoins = 0;

      return source.pipe(
        switchMap(data => {
          // Clear mapping on each emitted val ;
          // Save the parent data state
          collectionData = data as any[];

          // console.log(collectionData);

          const reads$ = [];
          for (const doc of collectionData) {
            // Push doc read to Array
            if (doc[field]) {
              // Perform query on join key, with optional limit
              // const q = ref => ref.where(field, '==', doc[field]).limit(limit);
              // console.log(collection + '/' + doc[field]);
              reads$.push(afs.doc(collection + '/' + doc[field]).valueChanges());
            } else {
              reads$.push(of([]));
            }
          }
          return combineLatest(reads$);
        }),
        map(joins => {
            return collectionData.map((v: any, i: any) => {
              // totalJoins += joins[i].length;
              return { ...v, [collection]: joins[i] || null };
          });
        }),
        tap(_final => {
            // console.log( `Queried ${(final as any).length}, Joined ${totalJoins} docs`);
          // totalJoins = 0;
        })
      );
    });
};


