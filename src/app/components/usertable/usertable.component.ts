import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';


// SERVICES
import { UserService } from '../../services/service.index';



@Component({
  selector: 'usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {


  dataSource;
  displayedColumns = ['name','email', 'employee']; 
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(private userService: UserService) {   
    console.log('usertable.components ejecutado');

  }

  ngOnInit() {
    this.userService.getUser().subscribe(results => {
      if(!results){
        return;
      }
       this.dataSource = new MatTableDataSource(results);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  } 
}

/*
export class UserDataSource extends DataSource<any> {	
	constructor(private userService: UserService) {
		super();
	}
	connect(): Observable<User[]>{		
		return this.userService.getUser();		
	}
	disconnect() { }
*/



