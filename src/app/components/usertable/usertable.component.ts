import {Component, OnInit, ViewChild} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { User } from '../../models/user';



@Component({
  selector: 'usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {

  //dataSource = new UserDataSource(this.userService);
  dataSource;
  displayedColumns = ['name','email', 'employee']; 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  
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



