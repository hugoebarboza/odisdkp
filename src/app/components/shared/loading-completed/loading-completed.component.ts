import { Component, OnInit } from '@angular/core';

import { LoadingCompletedService } from 'src/app/services/service.index';

@Component({
  selector: 'app-loading-completed',
  templateUrl: './loading-completed.component.html',
  styleUrls: ['./loading-completed.component.css']
})
export class LoadingCompletedComponent implements OnInit {

  constructor(public loadingService: LoadingCompletedService) { }

  ngOnInit(): void {

  }

}
