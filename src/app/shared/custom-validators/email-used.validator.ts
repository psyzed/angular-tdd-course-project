import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from '../../core/user.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  userService = inject(UserService);

  validate(
    control: AbstractControl<any, any>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.userService.isEmailTaken(control.value).pipe(
      map((res) => {
        return res ? { uniqueEmail: true } : null;
      }),
      catchError((err) => {
        return of(null);
      })
    );
  }
}
