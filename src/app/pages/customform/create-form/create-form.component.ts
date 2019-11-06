import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

// SERVICES
import { CustomformService, SettingsService, UserService } from 'src/app/services/service.index';

// MODELS
import { Proyecto } from 'src/app/models/types';


@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', {static: false}) sidenav: any;

  id = 0;
  identity: any;
  loading = true;
  isLoadingType = true;
  isLoadingProjectForm = true;
  opened: any = true;
  project: any;
  proyectos: Array<Proyecto> = [];
  projectformdata = [];
  sub: any;
  title = '';
  token: any;
  typedata = [];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(
    public _customForm: CustomformService,
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
    });


    this.sub = this._route.params.subscribe(params => {
      const id = +params['id'];
      this.id = id;
      if (this.id) {
        this.loading = true;
        this.project = this.filter();
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
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
    if (this.id > 0) {
      this.cargarProjectForm(this.id);
      this.cargarType(this.id);
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  sideNavOnClick() {
    this.sidenav.opened = !this.sidenav.opened;
  }

  async cargarType (id: number) {
    if (id && id > 0) {
      this.isLoadingType = true;
      this.typedata = [];

      const data: any = await this._customForm.getType(this.token.token);

      if (data && data.datos.length > 0) {
        this.isLoadingType = false;
        this.typedata = data.datos;
        this.cd.markForCheck();
      } else {
        this.isLoadingType = false;
        this.typedata = [];
        this.cd.markForCheck();
      }
    }
  }


  async cargarProjectForm (id: number) {
    if (id && id > 0) {
      this.isLoadingProjectForm = true;
      this.projectformdata = [];

      const data: any = await this._customForm.getProjectForm(this.token.token, id);

      if (data && data.datos.length > 0) {
        this.isLoadingProjectForm = false;
        this.projectformdata = data.datos;
        this.cd.markForCheck();
      } else {
        this.isLoadingProjectForm = false;
        this.projectformdata = [];
        this.cd.markForCheck();
      }
    }
  }


  addTypeForm (id: number) {
    console.log(id);
  }

}
