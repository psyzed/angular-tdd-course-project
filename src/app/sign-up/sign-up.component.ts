import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../core/user.service';
import { passwordMatchValidator } from '../shared/custom-validators/password-equality.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../core/customApiError.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../shared/button/button.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { UniqueEmailValidator } from '../shared/custom-validators/email-used.validator';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    NgClass,
    ButtonComponent,
    AlertComponent,
    NgIf,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private uniqueEmailValidator = inject(UniqueEmailValidator);

  public signUpForm!: FormGroup;
  public submitBtnDisabled = true;
  public isLoading = false;
  public showSignUpForm = true;

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        username: [null, [Validators.required, Validators.minLength(4)]],
        email: [
          null,
          {
            validators: [Validators.required, Validators.email],
            // asyncValidators: [
            //   this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)
            // ],
            // updateOn: 'blur',
          },
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
  }

  onSubmit(): void {
    this.isLoading = true;
    let value = this.signUpForm.value;
    this.userService.signUp(value).subscribe(
      (res) => {
        this.isLoading = false;
        this.showSignUpForm = false;
      },
      (err: HttpErrorResponse) => {
        const error: ErrorMessage = err.error;
        const emailError = error.validationErrors['email'];
        this.isLoading = false;
        this.signUpForm.get('email')?.setErrors({ backendError: emailError });
      }
    );
  }

  get usernameError(): string {
    const field = this.signUpForm.get('username');
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Username is required';
      } else {
        return 'Username must have more than 3 characters';
      }
    }
    return '';
  }

  get emailError(): string {
    const field = this.signUpForm.get('email');

    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Email is required';
      } else if (field.errors['email'] && field.touched) {
        return 'Please enter a valid Email';
      } else if (field.errors['uniqueEmail']) {
        return 'E-mail in use';
      } else if (field.errors['backendError']) {
        return field.errors['backendError'];
      }
    }
    return '';
  }

  get passwordError(): string {
    const field = this.signUpForm.get('password');

    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Password is required';
      } else if (field.errors['pattern']) {
        return 'Password must have at least 1 uppercase, 1 lowercase and 1 number';
      }
    }

    return '';
  }

  get formErrors(): string {
    const formErrors = this.signUpForm.errors;
    if (formErrors) {
      if (formErrors['passwordMismatch']) {
        return 'Passwords should match';
      }
    }
    return '';
  }
}
