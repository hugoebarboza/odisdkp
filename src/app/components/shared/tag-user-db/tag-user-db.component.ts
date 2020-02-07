import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { AngularFirestore } from '@angular/fire/firestore';

// MODELS
import { UserFirebase } from 'src/app/models/types';

// SERVICES
import { ProjectsService, UserService } from 'src/app/services/service.index';


export interface Users {
  id: any;
  name: string;
  surname: string;
  email: string;
}

@Component({
  selector: 'app-tag-user-db',
  templateUrl: './tag-user-db.component.html',
  styleUrls: ['./tag-user-db.component.css']
})
export class TagUserDbComponent implements OnInit, OnDestroy {

  activationTag = false;
  disableSelect = new FormControl(false);
  disableTagUser =  true;
  subscription: Subscription;
  token: any;
  userinput = new Subject<string>();
  userLoading: boolean;

  public forma: FormGroup;
  public usersFt: Users[];

  @Input() userFirebase: UserFirebase;
  @Input() id: number;
  @Output() tagUser: EventEmitter<Users[]>;


  constructor(
    private _afs: AngularFirestore,
    private _projectService: ProjectsService,
    public _userService: UserService,
  ) {
    this.tagUser = new EventEmitter();
    this.token = this._userService.getToken();
  }

  ngOnInit() {


    this._afs.firestore.doc(`users/${ this.userFirebase.uid }`).get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        this.activationTag = true;
      } else {
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

    this.loadusers(this.id);


    this.forma.get('destinatario').valueChanges
    .subscribe(response => {
          this.tagUser.emit(response);
      });
  }

  public loadusers(id: number) {
    const role = 7;
    this.subscription = this._projectService.getUserProject(this.token.token, id, role).subscribe(
      response => {
                if (!response) {
                  return;
                }
                if (response.status === 'success') {
                  // console.log(response);
                  this.usersFt = response.datos;
                }
                });
    // this.usersFt =

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
