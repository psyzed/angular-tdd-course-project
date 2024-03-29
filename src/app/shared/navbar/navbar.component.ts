import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent {
  public readonly authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.router.navigate(['/login']);
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
