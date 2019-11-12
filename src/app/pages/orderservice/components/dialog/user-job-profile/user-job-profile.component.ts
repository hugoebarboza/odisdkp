import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// SERVICES
import { ModalManageService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-user-job-profile',
  templateUrl: './user-job-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./user-job-profile.component.css']
})
export class UserJobProfileComponent implements OnInit, OnDestroy, OnChanges {

  isLoading = true;
  subscription: Subscription;
  title = 'Perfil del Usuario';
  token: any;
  user: any;

  @Input() id: number;

  constructor(
    private cd: ChangeDetectorRef,
    public _userService: UserService,
    public _modalManage: ModalManageService,
  ) {
    this.token = this._userService.getToken();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  ngOnChanges(_changes: SimpleChanges) {
    this.user = null;
    if (this.id > 0) {
      this.isLoading = true;
      this.subscription = this._userService.getUserShowInfo(this.token.token, this.id).subscribe(
        response => {
          this.isLoading = false;
          this.cd.markForCheck();
          if (!response) {
            return;
          }
          if (response.status === 'success') {
            this.user = response.data[0];
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.log(<any>error);
        }
      );
    }
  }


  hideModal() {
    this._modalManage.hideModal();
  }

}
