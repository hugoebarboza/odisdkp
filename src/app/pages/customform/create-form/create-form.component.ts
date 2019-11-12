import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// SERVICES
import { CustomformService, SettingsService, UserService } from 'src/app/services/service.index';

// MODELS
import { Form, Proyecto } from 'src/app/models/types';


@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', {static: false}) sidenav: any;

  forma: FormGroup;
  form: FormGroup = this.fb.group({
    items: this.fb.array([])
  });

  items: FormArray;

  formid = 0;
  formulario: any;
  id = 0;
  identity: any;
  isLoading = true;
  isLoadingType = true;
  isLoadingProjectForm = true;
  isLoadingProjectFormField = false;
  isLoadingFormulario = false;
  opened: any = true;
  project: any;
  proyectos: Array<Proyecto> = [];
  projectformdata = [];
  projectformfield = [];
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
    private fb: FormBuilder,
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
      const formid = +params['formid'];
      this.formid = formid;
      this.id = id;
      if (this.id) {
        this.project = this.filter();
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
        }
      }

      if (this.formid && this.formid > 0) {
        this.formulario = this.filterformulario(this.formid);
        if (this.formulario !== 'Undefined' && this.formulario !== null && this.formulario) {
          console.log(this.formulario);
          this.isLoading = true;
          this.resetForm(this.forma);
          this.resetForm(this.form);
          this.makeForma(this.formulario);
          this.cargarProjectFormField(this.id, this.formid); // Obtener los campos de un formulario
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

  filterformulario(id: number) {
    if (id && id > 0) {
      const formularios = this._userService.getFormularios();
      if (formularios && formularios.length > 0) {
        for (let i = 0; i < formularios.length; i += 1) {
          const result: any = formularios[i];
          if (result.id === id) {
              return result;
          }
        }
      }
    }
  }


  ngOnInit() {
    if (this.id > 0 && this.project !== 'Undefined' && this.project !== null && this.project) {
      this.cargarProjectForm(this.id); // Obtenes los formularios del proyecto
      this.cargarType(this.id); // Obtner los campos tipo para un formulario

      /*
      this.forma = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      });

      this.forma.setValue({
        'name': '',
        'description': '',
      });*/

    }
  }

  /*
  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  } */

  get getItems(): FormArray {
    return this.form.get('items') as FormArray;
  }

  /*
  createForm() {
    this.form = this.fb.group({
      items: this.fb.array([this.buildForm()])
    });
  }*/


  makeForma(data: any) {
    this.forma = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(2)]),
      servicetype_id: new FormControl(0, [Validators.required, Validators.minLength(1)]),
      status: new FormControl(0, [Validators.required, Validators.minLength(1)]),
    });

    this.forma.setValue({
      'name': data.name,
      'descripcion': data.descripcion,
      'servicetype_id': data.servicetype_id,
      'status': data.status
    });

    this.isLoading = false;
  }

  makeForm(data: any) {
    if (data && data.length > 0) {
      const toppingsFGs = data.map(topping => this.fb.group(topping));
      const topppingFormArray = this.fb.array(toppingsFGs);
      this.form.setControl('items', topppingFormArray);
    }
  }

  public buildForm(type: any, formid: number): FormGroup {

    return this.fb.group({
      id: new FormControl(0, Validators.required),
      form_id: new FormControl(formid, Validators.required),
      type_id: new FormControl(type.id, Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      predetermined: new FormControl(0, Validators.required),
      order_by: new FormControl(0, Validators.required),
      required: new FormControl(0, Validators.required),
      rol: new FormControl(0, Validators.required),
      type: new FormControl(type.type, Validators.required)
    });

    /*
    return this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required)
    }); */

/*
      "id": 5,
      "form_id": 1,
      "type_id": 1,
      "name": "Text 3",
      "description": "Prueba 777",
      "predetermined": 0,
      "order_by": 0,
      "required": 0,
      "rol": 1,
      "type": "text"
*/

    /*
    return this.fb.group({
      name: this.fb.control({ value: '' }, [Validators.required]),
      description: this.fb.control({ value: '' }, [Validators.required])
    }); */
  }

  resetForm(form: any) {
    if (form) {
      form.reset();
      form.setControl('items', this.fb.array([]));
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
        this.typedata = data.datos;
        this.isLoadingType = false;
        this.cd.markForCheck();
      } else {
        this.typedata = [];
        this.isLoadingType = false;
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
        this.projectformdata = data.datos;
        const key = 'formularios';
        this._userService.saveStorage(key, this.projectformdata);
        this.isLoadingProjectForm = false;
        this.cd.markForCheck();
      } else {
        this.projectformdata = [];
        this.isLoadingProjectForm = false;
        this.cd.markForCheck();
      }
    }
  }

  async cargarProjectFormField (id: number, formid: number) {
    if (id && id > 0 && formid && formid > 0) {
      this.isLoadingProjectFormField = true;
      this.projectformfield = [];

      const data: any = await this._customForm.getProjectFormField(this.token.token, id, formid);

      if (data && data.datos.length > 0) {
        this.projectformfield = data.datos;
        this.isLoadingProjectFormField = false;
        // this.createForm();
        this.makeForm(this.projectformfield);
        this.cd.markForCheck();
      } else {
        this.projectformfield = [];
        this.isLoadingProjectFormField = false;
        this.cd.markForCheck();
      }
    }
  }


  /*
  addItem(): void {
    if (this.form) {
      this.items = this.form.get('items') as FormArray;
      this.items.push(this.buildForm());
    }
  }*/


  addTypeForm (type: any) {
    if (type && this.formid && this.formid > 0) {
      this.getItems.push(this.buildForm(type, this.formid));
    } else {
      return;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    moveItemInArray(this.projectformfield, event.previousIndex, event.currentIndex);
    console.log(this.projectformfield);
  }

  async saveForma(forma: any) {
    if (!forma || forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const formulario: Form = new Form(this.formid, this.id, forma.value.servicetype_id, forma.value.name, forma.value.descripcion, forma.value.status, '', '', '', '');
    if (formulario && this.id > 0 && this.formid > 0) {
      const update: any = await this._customForm.update(this.token.token, formulario, this.id, this.formid);
      console.log(update);
      if (update && update.status === 'success') {
        console.log('paso update');
        this.cargarProjectForm(this.id);
      } else {
        Swal.fire('Importante', 'A ocurrido un error en la actualización de formulario', 'error');
        return;
      }
    } else {
      Swal.fire('Importante', 'A ocurrido un error en la actualización de formulario', 'error');
      return;
    }

  }

  saveForm(forma: any) {
    if (!forma) {
      return;
    }

  }


  deleteCampo(index: any) {
    this.getItems.removeAt(index);
    this.cd.markForCheck();
  }



}
