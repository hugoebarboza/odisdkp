import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  userid = 0;

  @Input() id: number;

  constructor(
    private cd: ChangeDetectorRef,
    public _userService: UserService,
    public _modalManage: ModalManageService,
  ) {
    this.token = this._userService.getToken();
    this.cd.markForCheck();
  }

  ngOnInit() {
    // console.log('oninit');
    // this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      // this.cd.markForCheck();
    }
  }


  ngOnChanges(_changes: SimpleChanges) {
    this.user = null;
    this.userid = 0;
    this.cd.markForCheck();
    // console.log(this.userid);
    if (this.id > 0) {
      const userid = this.id;
      this.userid = userid;
      this.isLoading = true;
      this.subscription = this._userService.getUserShowInfo(this.token.token, this.userid).subscribe(
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
