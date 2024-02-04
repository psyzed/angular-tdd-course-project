import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../core/user.service';
import { take } from 'rxjs';
import { User } from '../core/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styles: ``,
})
export class UserComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  public user!: User;
  public isLoading = false;

  ngOnInit(): void {
    this._loadUser();
  }

  private _loadUser(): void {
    this.isLoading = true;
    const userid: string = this.activatedRoute.snapshot.params['id'];
    this.userService
      .getUserById(userid)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.user = res;
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
}
