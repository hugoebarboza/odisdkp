export interface AtributoFirma { 
    id: number, 
    descripcion: string,
    datos: any,
    servicetype_id: number, 
    order_id: number,
    atributo_id: number,
    create_at: any
}


export class Color  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Column{
    name: string;
    descr: string;
    constructor(name,descr){
        this.name = name;
        this.descr = descr;
    }
}

export class Comuna  {
	
	constructor(	
	public id:number,
	public comuna_name:string,
	public commune_name:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Constante  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Customer  {
	
	constructor(		
	public id: any,
	public cc_number:any,
	public nombrecc:string,	
	public title:string,
	public description:string,

	public patio:any,
	public espiga:any,
	public posicion:any,
	
	public ruta:string,
	public calle:string,
	public numero:string,
	public block:string,
	public depto:string,	
	public latitud:string,
	public longitud:string,
	public id_region:any,
	public id_provincia:any,
	public id_comuna:any,

	public medidor:string,
	public modelo_medidor:string,	
	public id_tarifa:any,
	public id_constante:any,
	public id_giro:any,
	public id_sector:any,
	public id_zona:any,
	public id_mercado:any,
	
	public marca_id:any,
	public modelo_id:any,
	public color_id:any,
	public embarque_id:any,

	public name_table:any,
	
	public observacion:string,	
	public create_at:any,	
	public create_by:any,	
	public update_at:any,
	public update_by:any
	){}
}



export class Departamento  {
	
	constructor(	
	public id:number,
	public dept_name:string,
	public observacion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class FileItem {

    public archivo: File;
    public nombreArchivo: string;
    public type: string;
    public url: string;
    public created: string;
    public estaSubiendo: boolean;
    public progreso: number;

    constructor( archivo: File ) {

        this.archivo = archivo;
        this.nombreArchivo = archivo.name;
        this.type = archivo.type;
        this.estaSubiendo = false;
        this.progreso = 0;

    }

}


export class Giro  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export interface Item { id: any, nombre: string; type: string; url: any; created: any; }

export class Marca  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Mercado  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Modelo  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Order  {
	
	constructor(		
	public id:number,
	public assigned_to:any,
	public cc_number:any,
	public comuna: string,
	public create_at:any,	
	public create_by :any,
	public customer_id :number,
	public datos: any,
	public direccion: string,
	public estatus: string,
	public status_id: number,
	public imagen: any,	
	public important:any,
	public leido_por: any,
	public medidor: any,
	public order_number:any,
	public observation:string,
	public order_date:any,
	public provincia: string,
	public required_date:any,
	public service_id :number,
	public servicetype_id :number,	
	public servicetype:string,
	public status:any,
	public user:string,
	public userassigned: string,
	public update_at:any,
	public userupdate: string,
	public vencimiento_date:any,
	public orderatributofirma: any,
	public atributo_firma:any,
	public sign:number,
	public usercreate_id: any,
	public userupdate_id: any,
	){}
}


export interface OrderAtributoFirma { 
    id: number,
    order_id: number,
    atributo_id: number,
    nombre: string,
    archivo: any,
    status: number,
    create_at: any; 
}


export class ProjectServiceCategorie  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public create_at:any,	
	public update_at:any
	){}
}



export class ProjectServiceType  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public create_at:any,	
	public update_at:any
	){}
}



export class Provincia  {
	
	constructor(	
	public id:number,
	public provincia_name:string,
	public province_name:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Proyecto  {
	
	constructor(	
	public id:number,
	public project_name:string,
	public department_id:number,
	public observation:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Region  {
	
	constructor(	
	public id:number,
	public length:number,
	public region_name:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Sector  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Service  {
	
	constructor(	
	public id:number,
	public accept_edpdate: any,
	public address: any,
	public area_solicitante: any,
	public assigned_date_touser1: any,
	public assigned_date_touser2: any,
	public category_id:number,
	public checked_crodate: any,
	public cc_number:any,
	public comuna_id:number,
	public contratista: any,
	public contract_number: any,
	public cro_number: any,
	public cro_status: any,
	public create_by: any,
	public description: any,
	public due_date: any,
	public ejecutivo: any,
	public edp_amount: any,
	public edp_number: any,
	public edp_status: any,
	public gestor: any,
	public gom_number:any,
	public length: any,
	public mo_number: any,
	public name:any,
	public observation: any,
	public other_observation: any,
	public order_number:any,
	public other_ito_civil: any,
	public other_ito_electrico: any,
	public other_assigned_date_toitocivil: any,
	public other_assigned_date_toitoelec: any,
	public project: any,
	public project_id:number,
	public provincia_id:number,
	public reject_edpdate: any,
	public region_id:number,
	public responsable_obra: any,
	public responsable_phone: any,
	public responsable_email:any,
	public responsable_unidad:any,
	public responsable_unidad_phone: any,
	public responsable_unidad_email: any,
	public reception_date: any,
	public reception_crodate: any,
	public required_date: any,
	public send_edpdate: any,
	public service_id: any,
	public service_name:any,	
	public status:number,
	public update_by: any,
	public user_informador: any,
	public user_responsable:any,
	public user_itocivil_assigned_to: any,
	public user_itoelec_assigned_to: any,
	public type_id:number,		
	public unidad_responsable: any,
	public create_at:any,	
	public update_at:any
	){}
}

export class ServiceEstatus  {
	
	constructor(	
	public id:number,
	public service_id:number,
	public name:string,
	public label:number,
	public value:number,
	public create_at:any,	
	public update_at:any
	){}
}


export class ServiceType  {
	
	constructor(	
	public id:number,
	public service_id:number,
	public name:string,
	public create_at:any,	
	public update_at:any
	){}
}

export class Status  {	

	constructor(
	public id:number,
	public service_id:number,
    public name:string,
    public classlabel:string,
    public label:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Tarifa  {
	
	constructor(	
	public id:any,
	public descripcion:string,
	public status:any,	
	public create_at:any,	
	public update_at:any
	){}
}

export class User{
	constructor(				
		public id: any,
		public dni: any,
		public dv: any,
		public img: string,
		public name: string,
		public email: string,
		public password: string,
		public role_id: number,
		public surname: string,
		public version: string,
		public platform: number,
		public telefono1: any,
		public telefono2: any,
		public status: number,
		public project_id: number,
		public departamento_id: number,
	){}
}

export class UserGeoreference{
	constructor(				
		public id: number,
		public create_by: string,
		public latitud: any,
		public longitud: any,
		public create_at: any,
		public usuario: string,

	){}
}


export class Vehiculo  {
	
	constructor(	
	public id:number,
	public vim:string,
    public marca_id:number ,
    public modelo_id:number,
    public color_id:number ,
	public title:string,
	public description:string,	
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}

export class Zona  {
	
	constructor(	
	public id:number,
	public descripcion:string,
	public status:number,	
	public create_at:any,	
	public update_at:any
	){}
}