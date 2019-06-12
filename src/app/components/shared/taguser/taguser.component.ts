import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Subject, Observable, concat, of } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';

//MODELS
import { UserFirebase } from 'src/app/models/types';

export interface Users {
  id: any;
  name: string;
  surname: string;
  email: string;
}

@Component({
  selector: 'app-taguser',
  templateUrl: './taguser.component.html',
  styleUrls: ['./taguser.component.css']
})
export class TagUserComponent implements OnInit {

  activationTag: boolean = false;
  disableSelect = new FormControl(false);
  disableTagUser =  true;
  userinput = new Subject<string>();
  userLoading: boolean;

  public forma: FormGroup;
  public usersFt: Observable<Users[]>;
  private usersCollection: AngularFirestoreCollection<Users>;

  @Input() userFirebase : UserFirebase;
  @Output() tagUser: EventEmitter<Users[]>;

  constructor(
    private _afs: AngularFirestore,    
  ) { 
    this.tagUser = new EventEmitter();
  }

  ngOnInit() {

    this._afs.firestore.doc(`users/${ this.userFirebase.uid }`).get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        //console.log('exist')
        this.activationTag = true;
      }else{
        //console.log('user no exist')
      }
    });

    this.forma = new FormGroup({
      select: new FormControl (false),
      destinatario: new FormControl ({value: null, disabled: false}, [Validators.required, Validators.minLength(1)]),
    });

    this.forma.setValue({
      'select': '',
      'destinatario': '',
    });

    this.loadusers();


    this.forma.get('destinatario').valueChanges
    .subscribe(response => {
          this.tagUser.emit(response);
      });

  }


public loadusers() {

    this.usersFt = concat(
      of(null), // default items
      this.userinput.pipe(
         debounceTime(200),
         distinctUntilChanged(),
         tap(() => this.userLoading = true),
         switchMap(term => this.getListuser(term).pipe(
             catchError(() => of(null)), // empty list on error
             tap(() => this.userLoading = false)
         ))
      )
    );
}  
  

public getListuser(term: string) {

  this.usersCollection = this._afs.collection<Users>('users', ref => ref.where('email', '>=', term));
  return this.usersCollection.stateChanges(['added'])
              .map(actions => {
                return actions.map(a => {
                  const data = a.payload.doc.data() as Users;
                  const id = a.payload.doc.id;
                  //console.log(data);
                  return { id, ...data };
                });
              });
}


 toggleDisable() {
  this.forma.get('select').valueChanges
  .subscribe(response => {
    if(response == true){
      this.forma.get('destinatario').enable();
    }else{
      this.forma.get('destinatario').disable();
    }
  });
 } 
 

}
