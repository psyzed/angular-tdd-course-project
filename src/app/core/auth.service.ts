import { Injectable, inject } from '@angular/core';
import { LoggedInUser, User } from './user.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BrowserStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<LoggedInUser | null>(null);

  public user$: Observable<LoggedInUser | null> =
    this.userSubject.asObservable();
  public isLoggedIn$: Observable<boolean>;

  private localStorage = inject(BrowserStorageService);

  constructor() {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
  }

  setUser(user: User): void {
    const loggedInUser: LoggedInUser = {
      ...user,
      isLoggedIn: true,
    };
    this.userSubject.next(loggedInUser);
    this.localStorage.set('user', loggedInUser);
  }

  getUserFromLocalStorage(): void {
    let userData = this.localStorage.get('user');
    if (userData) {
      let user: LoggedInUser = JSON.parse(userData);
      this.userSubject.next(user);
    }
  }

  logout(): void {
    this.localStorage.remove('user');
    this.userSubject.next(null);
  }
}
