import { Component, Input, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// SERVICES
import { ModalManageService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-user-job-profile',
  templateUrl: './user-job-profile.component.html',
  styleUrls: ['./user-job-profile.component.css']
})
export class UserJobProfileComponent implements OnDestroy, OnChanges {

  @Input() id: number;

  isLoading = true;
  subscription: Subscription;
  title = 'Perfil del Usuario';
  token: any;
  user: any;

  constructor(
    private cd: ChangeDetectorRef,
    public _userService: UserService,
    public _modalManage: ModalManageService,
  ) {
    this.token = this._userService.getToken();
    this.cd.markForCheck();
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      // this.cd.markForCheck();
    }
  }


  ngOnChanges(_changes: SimpleChanges) {
    this.user = null;
    let userid = 0;
    this.cd.markForCheck();
    if (this.id > 0) {
      userid = this.id;
      this.isLoading = true;
      this.subscription = this._userService.getUserShowInfo(this.token.token, userid).subscribe(
        response => {
          this.isLoading = false;
          this.cd.markForCheck();
          if (!response) {
            return;
          }
          if (response.status === 'success') {
            this.user = response.data[0];
            this.isLoading = false;
            // console.log(this.user);
          }
        },
        (error: any) => {
          this.isLoading = false;
          this.cd.markForCheck();
          console.log(<any>error);
        }
      );
    }
  }


  hideModal() {
    this._modalManage.hideModal();
    // this.cd.markForCheck();
  }

}
