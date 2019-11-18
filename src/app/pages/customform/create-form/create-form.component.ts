import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { TooltipPosition, MatDialog } from '@angular/material';
import Swal from 'sweetalert2';

// COMPONENTS
import { EditFormComponent } from '../dialog/edit-form/edit-form.component';
import { MakeFormComponent } from '../dialog/make-form/make-form.component';

// SERVICES
import { CustomformService, SettingsService, UserService } from 'src/app/services/service.index';

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

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

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi'
  ];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);


  constructor(
    public _customForm: CustomformService,
    private _route: ActivatedRoute,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public label: SettingsService,
    media: MediaMatcher,
    public toasterService: ToastrService,
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => cd.detectChanges();
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
          // console.log(this.formulario);
          this.isLoading = true;
          this.projectformfield = [];
          this.resetForm(this.forma);
          this.resetForm(this.form);
          // this.makeForma(this.formulario);
          this.cargarProjectFormField(this.id, this.formid); // Obtener los campos de un formulario
        } else {
          this.formid = 0; // Inicializa ID del formulario a 0, ya que, pudo haber sido eliminado o no esta asociado algún formulario
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
    }
  }

  /*
  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  } */

  get getItems(): FormArray {
    return this.form.get('items') as FormArray;
  }


  makeForma(data: any) {
    this.isLoading = true;
    this.forma = new FormGroup({
      id: new FormControl(0, [Validators.required, Validators.minLength(2)]),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(2)]),
      service_id: new FormControl(0, [Validators.required, Validators.minLength(1)]),
      servicetype_id: new FormControl(0, [Validators.required, Validators.minLength(1)]),
      status: new FormControl(0),
    });

    this.forma.setValue({
      'id': data.id,
      'name': data.name,
      'descripcion': data.descripcion,
      'service_id': data.service_id,
      'servicetype_id': data.servicetype_id,
      'status': data.status
    });

    this.isLoading = false;
    this.cd.markForCheck();
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
      description: new FormControl(''),
      predetermined: new FormControl(0, Validators.required),
      order_by: new FormControl(0, Validators.required),
      required: new FormControl(0, Validators.required),
      rol: new FormControl(1, Validators.required),
      type: new FormControl(type.type, Validators.required)
    });

    /*
    return this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required)
    }); */


    /*
    return this.fb.group({
      name: this.fb.control({ value: '' }, [Validators.required]),
      description: this.fb.control({ value: '' }, [Validators.required])
    }); */
  }

  public buildType(type: any, formid: number) {

    const payload = {
      id: 0,
      form_id: formid,
      type_id: type.id,
      name: '',
      description: '',
      predetermined: 0,
      order_by: 0,
      required: 0,
      rol: 1,
      type: type.type,
    };

    return payload;

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

      if  (data && data.datos_forma) {
        this.makeForma(data.datos_forma);
      }

      if (data && data.datos.length > 0) {
        this.projectformfield = data.datos;
        // console.log(this.projectformfield);
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


  drop(event: CdkDragDrop<string[]>) {
    if (this.form && this.form.value && this.form.value.items && this.form.value.items.length > 0) {
      moveItemInArray(this.projectformfield, event.previousIndex, event.currentIndex);
      this.makeForm(this.projectformfield);
    }
    // console.log(this.projectformfield);
    // console.log(this.form.value.items);
  }


  addForma(data: any) {
    if (!data) {
      return;
    }

    const dialogRef = this.dialog.open(MakeFormComponent, {
      width: '477px',
      disableClose: true,
      data: { data: data,
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 1) {
      }
    });
  }

  async saveForma(forma: any) {
    if (!forma || forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    let status = forma.value.status;
    if (!status) {
      status = 0;
    }

    if (status === true ) {
      status = 1;
    }

    const formulario: Form = new Form(this.formid, this.id, forma.value.service_id, forma.value.servicetype_id, forma.value.name, forma.value.descripcion, status, '', '', '', '');


    if (formulario && this.id > 0 && this.formid > 0) {
      const update: any = await this._customForm.update(this.token.token, formulario, this.id, this.formid);
      if (update && update.status === 'success') {
        this.cargarProjectForm(this.id);
        this.toasterService.success('Formulario actualizado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error en la actualización de formulario', 'error');
        return;
      }
    } else {
      Swal.fire('Importante', 'A ocurrido un error en la actualización de formulario', 'error');
      return;
    }

  }


  updateForma(forma) {
    if (!forma) {
      return;
    }

    const dialogRef = this.dialog.open(EditFormComponent, {
      width: '477px',
      disableClose: true,
      data: forma.value
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 1) {

      }
    });
  }

  async deleteForma(forma) {
    if (!forma) {
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción es permanente. ¿Seguro de que quieres eliminar Formulario?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( async borrar => {
      if (borrar.value) {
        if (borrar) {
          const deleteform: any = await this._customForm.delete(this.token.token, this.id, forma.value.id);
          if (deleteform && deleteform.status === 'success') {
            this.cargarProjectForm(this.id);
            this.formid = 0; // Inicializar el ID del Formulario
            this.toasterService.success('Formulario eliminado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
            this.cd.markForCheck();
          } else {
            Swal.fire('Importante', 'A ocurrido un error en la eliminación. Verifique si existen ordenes asociadas al formulario.', 'error');
            return;
          }
        }
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });
  }


  addFormField (type: any) {
    if (type && this.formid && this.formid > 0) {
      this.getItems.push(this.buildForm(type, this.formid));
      this.projectformfield.push(this.buildType(type, this.formid));
    } else {
      return;
    }
  }



  async saveFormField(forma: FormGroup) {
    if (!forma && forma.value) {
      return;
    }

    const formulario = forma.value;

    if (formulario && this.id > 0 && this.formid > 0) {
      const update: any = await this._customForm.updateFormField(this.token.token, formulario, this.id, this.formid);
      if (update && update.status === 'success') {
        this.cargarProjectFormField(this.id, this.formid);
        this.toasterService.success('Formulario actualizado exitosamente.', 'Exito', {timeOut: 4000, closeButton: true, });
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error en la actualización de campos del formulario.', 'error');
        return;
      }
    } else {
      Swal.fire('Importante', 'A ocurrido un error en la actualización de campos del formulario.', 'error');
      return;
    }


  }


  async deleteFormField(index: any) {

        const indexarray: any = await this.findWithAttr(this.projectformfield, 'id', 0, index);
        if (indexarray > -1) {
          this.getItems.removeAt(index);
          this.projectformfield.splice(index, 1);
          this.cd.markForCheck();
        } else {
          Swal.fire({
            title: '¿Esta seguro?',
            text: 'Esta acción es permanente. ¿Seguro de que quieres eliminar el Campo del Formulario?',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          })
          .then( async borrar => {
            if (borrar.value) {
              if (borrar) {
                const field: any = await this.filterArray(this.projectformfield, index);
                if (field && field.id > 0) {
                  const deleteformfield: any = await this._customForm.deleteFormField(this.token.token, this.id, this.formid, field.id);
                  if (deleteformfield && deleteformfield.status === 'success') {
                    this.cargarProjectFormField(this.id, this.formid);
                    this.toasterService.success('Formulario actualizado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
                    return;
                  } else {
                    Swal.fire('Importante', 'A ocurrido un error en la eliminación del campo del formulario. ' + deleteformfield.message, 'error');
                    return;
                  }
                }
              }
            } else if (borrar.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
              );
            }
          });
        }
  }


  async findWithAttr(array, attr, value, index) {
    for (let i = 0; i < array.length; i += 1) {
      if (i === index) {
        if (array[i][attr] === value) {
          return i;
        }
      }
    }
    return -1;
  }

  async filterArray(array, index) {
    if (array) {
      for (let i = 0; i < array.length; i += 1) {
        if (i === index) {
          return array[i];
        }
      }
      return -1;
    }
  }


}
