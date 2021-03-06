import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { defer, combineLatest, of } from 'rxjs/';
import { switchMap, map, tap, finalize } from 'rxjs/operators';
import { TooltipPosition } from '@angular/material';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

//FIREBASE
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument 
} from 'angularfire2/firestore';

import { AngularFireAuth } from 'angularfire2/auth';

//MODELS
import { Proyecto, User } from 'src/app/models/types';

//SERVICES
import { SettingsService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-notification-unread',
  templateUrl: './notification-unread.component.html',
  styleUrls: ['./notification-unread.component.css']
})
export class NotificationUnreadComponent implements OnInit, OnDestroy {




  identity: any;
  isLoading: boolean = false;
  isSave: boolean = false;
  proyectos: Array<Proyecto>;
  resultCount: number;
  resultCountUnread: number;
  resultCountRead: number;
  show:boolean = false;
  subscription: Subscription;
  subscriptionunread: Subscription;
  subscriptionread: Subscription;
  status: string;
  title: string;
  totalNotifications: number = 0;


  notificationsRef: AngularFirestoreCollection<any>;
  notificationsUnreadRef: AngularFirestoreCollection<any>;
  notificationsReadRef: AngularFirestoreCollection<any>;
  notifications$: any;
  getnotifications$: Observable<any>;
  getnotificationsUnread$: Observable<any>;
  getnotificationsRead$: Observable<any>;
  private userDoc: AngularFirestoreDocument<User>;
  user$: Observable<User>;
  userid: any;
  responsearray = [];
  count: number;

  @ViewChild( CdkVirtualScrollViewport,  { static: false } ) viewport: CdkVirtualScrollViewport;


  displayedColumns: string[] = ['project', 'service', 'title', 'body', 'create_by','create_at', 'status']; 
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionleftaction = new FormControl(this.positionOptions[4]);  

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    public label: SettingsService,
    public _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.isSave = false;
    this.proyectos = this._userService.getProyectos();
    this.show = false;
		this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
		});


  }

  ngOnInit() {
    this.show = false;
    this.isLoading = true;

    this.afAuth.authState.take(1).subscribe(user => {
      this.isLoading = false;
      if (!user) return;
      this.userid = user.uid;
      this.userDoc = this.afs.doc<User>(`/users/${user.uid}`);
      this.user$ = this.userDoc.valueChanges();      

      /*********Get All */
      this.notificationsRef = this.userDoc.collection('notifications', ref => ref.orderBy('create_at', 'desc') )
      this.subscription = this.notificationsRef.snapshotChanges()
      .pipe(
        map(actions => {
          this.resultCount = actions.length;
        })
      ).subscribe();



      /*********Get unread */
      this.notificationsUnreadRef = this.userDoc.collection('notifications', ref => ref.where('status', '==', '1').orderBy('create_at', 'desc') )
      this.subscriptionunread = this.notificationsUnreadRef.snapshotChanges()
      .pipe(
        map(actions => {
          this.resultCountUnread = actions.length;
          //console.log(this.resultCountUnread);
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })        
      ).subscribe((collection: any[]) => {
        //this.responsearray = response;
        this.count = Object.keys(collection).length;
        if(this.count == 0){
          this.notifications$ = '';    
        }else{
          this.gojoin(Observable.of(collection));
        }
      }
      );


      /*
      this.getnotificationsUnread$.subscribe(response => {
        this.responsearray = response;
        this.count = Object.keys(this.responsearray).length;
        if(this.count == 0){
          this.notifications$ = '';    
        }
      }
      );*/
      /*
      this.notifications$ = this.getnotificationsUnread$
      .pipe(
          leftJoin(this.afs, 'create_by', 'users')
      );*/
  

      /*********Get read */
      this.notificationsReadRef = this.userDoc.collection('notifications', ref => ref.where('status', '==', '0') )
      this.subscriptionread = this.notificationsReadRef.snapshotChanges()
      .pipe(
        map(actions => {
          this.resultCountRead = actions.length;
        })
      ).subscribe();



    })
  }

  gojoin(collection): Observable<any> {
    return this.notifications$ = collection.pipe(
      leftJoin(this.afs, 'create_by', 'users')
    );
  }


  irInicio() {
    this.viewport.scrollToIndex( 0 );
  }


  irFinal() {
    this.viewport.scrollToIndex( this.resultCount );
  }

  ngOnDestroy() {
    if(this.subscription){
      //console.log('unsubscribe notification');
      this.subscription.unsubscribe();
    }

    if(this.subscriptionunread){
      //console.log('unsubscribe notification unread');
      this.subscriptionunread.unsubscribe();
    }

    if(this.subscriptionread){
      //console.log('unsubscribe notification read');
      this.subscriptionread.unsubscribe();
    }
  }


  update(notificationKey, value) {
    if(!notificationKey){
      return
    }

    if(!value.status){
      return
    }

    if (value.status==1){
      this.status = '0';
    }
    if (value.status==0){
      this.status = '1';
    }
    //return  this.afs.doc<User>(`/users/${this.userid}`).collection('notifications').set(value);

    const userDoc = this.afs.doc<User>(`/users/${this.userid}`);
    return userDoc.collection('notifications').doc(notificationKey).update({status : this.status});
  }


  paginate( valor: number, increment:number ) {
    this.ngOnInit();
  }


  refreshMenu(event:number){
		if(event == 1){
		}
	}


  toggle() {
    this.show = !this.show;
  }


}


export const leftJoin = (
  afs: AngularFirestore,
  field,
  collection,
  limit = 100
) => {
  return source =>
    defer(() => {
      // Operator state

      let collectionData;

      // Track total num of joined doc reads
      let totalJoins = 0;

      return source.pipe(
        switchMap(data => {
          // Clear mapping on each emitted val ;
          // Save the parent data state
          collectionData = data as any[];

          //console.log(collectionData);
          //console.log('joinnnnnnnnnnnnnnnnnnnnnnnnnnnnn');

          const reads$ = [];
          for (const doc of collectionData) {
            // Push doc read to Array
            if (doc[field]) {
              // Perform query on join key, with optional limit
              // const q = ref => ref.where(field, '==', doc[field]).limit(limit);
              //console.log(collection + '/' + doc[field]);
              reads$.push(afs.doc(collection + '/' + doc[field]).valueChanges());
            } else {
              reads$.push(of([]));
            }
          }

          return combineLatest(reads$);
        }),
        map(joins => {
          return collectionData.map((v: any, i: any) => {
            totalJoins += joins[i].length;
            return { ...v, [collection]: joins[i] || null };
          });
        }),
        tap(final => {
            // console.log( `Queried ${(final as any).length}, Joined ${totalJoins} docs`);
          totalJoins = 0;
        })
      );
    });
};
