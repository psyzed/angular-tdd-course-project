import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../core/user.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [AlertComponent, NgIf],
  templateUrl: './activate.component.html',
  styles: ``,
})
export class ActivateComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  public notificationMessage = '';
  public alertType!: 'success' | 'danger';
  public isLoading = false;

  ngOnInit(): void {
    this._sendToken();
  }

  private _sendToken(): void {
    this.isLoading = true;
    const id: string = this.activatedRoute.snapshot.params['id'];
    this.userService
      .activateAccount(id)
      .pipe()
      .subscribe(
        (res) => {
          this.notificationMessage = 'Account is activated';
          this.alertType = 'success';
          this.isLoading = false;
        },
        (err) => {
          this.notificationMessage = 'Account activation failed';
          this.alertType = 'danger';
          this.isLoading = false;
        }
      );
  }
}
