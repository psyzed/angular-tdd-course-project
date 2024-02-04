import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserPage, UserSignupInfo } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);

  signUp(user: UserSignupInfo): Observable<UserSignupInfo> {
    return this._http.post<UserSignupInfo>('/api/1.0/users', user);
  }

  getUsersList(page: number = 0): Observable<UserPage> {
    return this._http.get<UserPage>('/api/1.0/users', {
      params: { size: 3, page },
    });
  }

  getUserById(id: string): Observable<User> {
    return this._http.get<User>('/api/1.0/users/' + id);
  }

  isEmailTaken(email: string): Observable<UserSignupInfo> {
    return this._http.post<UserSignupInfo>('/api/1.0/user/email', {
      email: email,
    });
  }

  activateAccount(token: string): Observable<UserSignupInfo> {
    return this._http.post<UserSignupInfo>('/api/1.0/users/token/' + token, {});
  }
}
