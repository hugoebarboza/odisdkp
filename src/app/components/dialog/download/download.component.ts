import { Component } from '@angular/core';
import { MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {

  constructor(
  	private bottomSheetRef: MatBottomSheetRef<DownloadComponent>
  	) { }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
