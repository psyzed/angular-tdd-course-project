import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AlertComponent } from '../shared/alert/alert.component';
import { ButtonComponent } from '../shared/button/button.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignUpComponent,
        HttpClientTestingModule,
        AlertComponent,
        ButtonComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('layout', () => {
    it('has sign up header', () => {
      const signUp: HTMLElement = fixture.nativeElement;
      const h1 = signUp.querySelector('h1');
      expect(h1?.textContent).toBe('Sign Up');
    });

    it('has user input element', () => {
      const signUp: HTMLElement = fixture.nativeElement;
      const labelEl: HTMLElement = signUp.querySelector(
        'label[for="username"]'
      )!;
      const userNameInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="username"]'
      )!;
      expect(userNameInputEl).toBeTruthy();
      expect(labelEl).toBeTruthy();
      expect(labelEl.textContent).toContain('Username');
    });

    it('has email input element', () => {
      const signUp: HTMLElement = fixture.nativeElement;
      const labelEl: HTMLElement = signUp.querySelector('label[for="email"]')!;
      const emailInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="email"]'
      )!;
      expect(labelEl).toBeTruthy();
      expect(labelEl.textContent).toContain('E-mail');
      expect(emailInputEl).toBeTruthy();
    });
    it('has password input element', () => {
      const signUp: HTMLElement = fixture.nativeElement;
      const labelEl: HTMLElement = signUp.querySelector(
        'label[for="password"]'
      )!;
      const passInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="password"]'
      )!;
      expect(labelEl).toBeTruthy();
      expect(labelEl.textContent).toContain('Password');
      expect;
      expect(passInputEl).toBeTruthy();
      expect(passInputEl.type).toBe('password');
    });

    it('has confirm pass input element', () => {
      const signUp: HTMLElement = fixture.nativeElement;
      const labelEl: HTMLElement = signUp.querySelector(
        'label[for="confirm-password"]'
      )!;
      const passInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="confirmPassword"]'
      )!;
      expect(labelEl).toBeTruthy();
      expect(labelEl.textContent).toContain('Confirm Password');
      expect;
      expect(passInputEl).toBeTruthy();
      expect(passInputEl.type).toBe('password');
    });

    it('has submit button element', () => {
      const signUp = fixture.nativeElement;
      const buttonEl: HTMLButtonElement = signUp.querySelector('button');
      expect(buttonEl.textContent).toContain('Sign Up');
      expect(buttonEl.type).toBe('button');
    });

    it('button disabled initially', () => {
      const signUp = fixture.nativeElement;
      const buttonEl: HTMLButtonElement = signUp.querySelector('button');
      expect(buttonEl.textContent).toContain('Sign Up');
      expect(buttonEl.disabled).toBeTruthy();
    });
  });

  describe('interactions', () => {
    let httpTestingController: HttpTestingController;
    let button: HTMLButtonElement;
    let signUp: HTMLElement;

    const setupForm = () => {
      httpTestingController = TestBed.inject(HttpTestingController);
      signUp = fixture.nativeElement;
      const userNameInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="username"]'
      )!;

      userNameInputEl.value = 'user1';
      userNameInputEl.dispatchEvent(new Event('input'));
      const emailInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="email"]'
      )!;
      emailInputEl.value = 'user@gmail.com';
      emailInputEl.dispatchEvent(new Event('input'));
      const passInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="password"]'
      )!;
      passInputEl.value = 'password';
      passInputEl.dispatchEvent(new Event('input'));
      const confirmInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="confirmPassword"]'
      )!;
      confirmInputEl.value = 'password';
      confirmInputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      button = signUp.querySelector('button')!;
      expect(button.textContent).toContain('Sign Up');
    };

    it('enables the button when pass fields have the same value', () => {
      setupForm();
      expect(button.disabled).toBeFalsy();
    });

    it('submit form data', () => {
      setupForm();
      button.click();
      const request = httpTestingController.expectOne('/api/1.0/users');
      const body = request.request.body;
      expect(body).toEqual({
        username: 'user1',
        email: 'user@gmail.com',
        password: 'password',
        confirmPassword: 'password',
      });
    });

    it('disable button when ongoing api request', () => {
      setupForm();
      button.click();
      fixture.detectChanges();
      button.click();
      httpTestingController.expectOne('/api/1.0/users');
      expect(button.disabled).toBeTruthy();
    });

    it('shows spinner while request in progress', () => {
      setupForm();
      expect(signUp.querySelector('span[role="status"]')).toBeFalsy();
      expect(signUp.querySelector('.loading-text')).toBeFalsy();
      button.click();
      fixture.detectChanges();
      expect(signUp.querySelector('span[role="status"]')).toBeTruthy();
      expect(signUp.querySelector('.loading-text')).toBeTruthy();
    });

    it('show account activation notification upon successfull request', () => {
      setupForm();
      expect(signUp.querySelector('.alert-success')).toBeFalsy();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});
      fixture.detectChanges();
      const message = signUp.querySelector('.alert-success');
      expect(message?.textContent).toContain(
        'Please check your e-mail to activate your account'
      );
    });

    it('hide form after successfull sign up', () => {
      setupForm();
      expect(
        signUp.querySelector('div[data-testid=sign-up-form]')
      ).toBeTruthy();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});
      fixture.detectChanges();
      expect(signUp.querySelector('div[data-testid=sign-up-form]')).toBeFalsy();
    });
  });
});
