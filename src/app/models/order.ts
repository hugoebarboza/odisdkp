export class Order  {
	
	constructor(	
	public id:number,
	public order_number:string,
	public service_id :number,
	public servicetype_id :number,
	public datos: any,
	public servicetype:string,
	public status:number,		
	public customer_id :number,
	public cc_number:string,
	public observation:string,
	public order_date:any,
	public important:any,
	public assigned_to:any,
	public required_date:any,
	public vencimiento_date:any,
	public create_at:any,	
	public update_at:any,
	public create_by :number	
	){}
}
