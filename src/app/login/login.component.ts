import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../shared/button/button.component';
import { Subject, take, takeUntil, timer, firstValueFrom } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, AlertComponent, NgClass],
  templateUrl: './login.component.html',
  styles: [``],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public isLoading = false;
  public hasError = false;

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this._initForm();
    this._getFormValueChanges();
  }

  onLogin(): void {
    this.isLoading = true;
    this.hasError = false;
    const creds = this.loginForm.value;
    this.authService
      .authenticate(creds)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        (err) => {
          this.isLoading = false;
          this.hasError = true;
        }
      );
  }

  get emailErrors(): string {
    const emailfield = this.loginForm.get('email');
    if (emailfield?.touched && emailfield.errors) {
      if (emailfield.errors['required']) {
        return 'Email is required';
      } else {
        return 'Please enter a valid Email';
      }
    }
    return '';
  }

  get passwordErrors(): string {
    const passwordField = this.loginForm.get('password');
    if (passwordField?.touched && passwordField.errors) {
      if (passwordField.errors['required']) {
        return 'Password is required';
      } else {
        return 'Password must have at least 1 uppercase, 1 lowercase and 1 number';
      }
    }
    return '';
  }

  private _getFormValueChanges(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((values) => {
        this.hasError = false;
      });
  }

  private _initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      password: [
        null,
        [
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/),
          ,
          Validators.required,
        ],
      ],
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
