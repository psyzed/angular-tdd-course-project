import { Injectable, inject } from '@angular/core';
import { LoggedInUser, User } from './user.model';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { BrowserStorageService } from './localStorage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<LoggedInUser | null>(null);
  private _http = inject(HttpClient);

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

  authenticate(creds: { email: string; password: string }): Observable<User> {
    return this._http.post<User>('/api/1.0/auth', creds).pipe(
      tap((res) => {
        this.setUser(res);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    this.localStorage.remove('user');
    this.userSubject.next(null);
    return this._http.post<{ message: string }>('/api/1.0/logout', {});
  }
}
