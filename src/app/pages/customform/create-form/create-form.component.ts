import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

// SERVICES
import { SettingsService, UserService } from 'src/app/services/service.index';

// MODELS
import { Proyecto } from 'src/app/models/types';


@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit, OnDestroy {

  id = 0;
  identity: any;
  loading = true;
  project: any;
  proyectos: Array<Proyecto> = [];
  sub: any;
  title = '';
  token: any;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(
    private _route: ActivatedRoute,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public label: SettingsService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
      console.log(this.title);
    });


    this.sub = this._route.params.subscribe(params => {
      const id = +params['id'];
      this.id = id;
      if (this.id) {
        this.loading = true;
        this.project = this.filter();
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
          console.log(this.project);
        }
      }
      this.cd.markForCheck();
    });
  }

  filter() {
    if (this.proyectos && this.id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.id) {
            return result;
        }
      }
    }
  }


  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


}
