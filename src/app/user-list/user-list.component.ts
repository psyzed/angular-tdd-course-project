import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../core/user.service';
import { map, take } from 'rxjs';
import { User, UserPage } from '../core/user.model';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserListItemComponent } from './user-list-item/user-list-item.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, UserListItemComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  public users: User[] = [];
  public pagination: { page: number; size: number; totalPages: number } = {
    page: 0,
    size: 3,
    totalPages: 0,
  };

  public isNextBtnHidden = false;
  public isLoading = false;

  ngOnInit(): void {
    this.onLoadUsers();
  }

  onLoadUsers(page: number = 0): void {
    this.isLoading = true;
    this.userService
      .getUsersList(this.pagination.page + page)
      .pipe(
        take(1),
        map((res) => {
          const { content: users, ...pageInfo } = res;
          return { users, pageInfo };
        })
      )
      .subscribe((res) => {
        this.isLoading = false;
        this.users = res.users;
        this.pagination = res.pageInfo;
      });
  }

  get hasNextPages(): boolean {
    const { page, totalPages } = this.pagination;
    return totalPages > page + 1;
  }

  get hasPreviousBtn(): boolean {
    const { page } = this.pagination;
    return page > 0;
  }

  onNavigate(id: number): void {
    this.router.navigate(['/user/', id]);
  }
}
