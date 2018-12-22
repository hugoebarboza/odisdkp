export class Marcador  {
  public lat: number;
  public lng: number;
  public titulo: string;
  public subtitulo: string;
  public label: number;
  public icon: string;
  public direccion: string;
  public create_at: string;
  public update_at: string;
  public create_by: string;
  public update_by: string;
  public estatus: string;

	constructor(
		lat:number,
		lng:number,
		titulo:string,
		subtitulo:string,
		label:number,
		icon:string,
		direccion:string,		
		create_at: string,
  		update_at: string,
		create_by: string,
  		update_by: string,  		
  		estatus: string,  		
	) 
	{
		this.lat = lat;
		this.lng = lng;
		this.titulo = titulo;
		this.subtitulo = subtitulo;
		this.label = label;
		this.icon = icon;
		this.direccion = direccion;
		this.create_at = create_at;
		this.update_at = update_at;
		this.create_by = create_by;
		this.update_by = update_by;
		this.estatus = estatus;
	}
}