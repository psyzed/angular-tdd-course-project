import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertComponent } from '../shared/alert/alert.component';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private httpClient = inject(HttpClient);

  public signUpForm!: FormGroup;
  public submitBtnDisabled = true;
  public isLoading = false;
  public showSignUpForm = true;

  private password = '';
  private confirmPassword = '';

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: [null],
      email: [null],
      password: [null],
      confirmPassword: [null],
    });
  }

  onInputUserName(): void {
    let inputEl: AbstractControl = this.signUpForm.get('username')!;
    let value = inputEl.value;
  }

  onInputEmail(): void {
    let inputEl: AbstractControl = this.signUpForm.get('email')!;
    let value = inputEl.value;
  }

  onInputPass(e: Event): void {
    let inputEl = e.target as HTMLInputElement;
    let value = inputEl.value;
    this.password = value;
    this._comparePasswords();
  }

  onInputConfirmPass(): void {
    let inputEl: AbstractControl = this.signUpForm.get('confirmPassword')!;
    let value = inputEl.value;
    this.confirmPassword = value;
    this._comparePasswords();
  }

  onSubmit(): void {
    this.isLoading = true;
    let value = this.signUpForm.value;
    this.httpClient.post('/api/1.0/users', { ...value }).subscribe(
      () => {
        this.isLoading = false;
        this.showSignUpForm = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  private _comparePasswords(): void {
    this.submitBtnDisabled = this.password !== this.confirmPassword;
  }
}
