import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NgClass, NgFor } from '@angular/common';
import { AlertComponent } from '../shared/alert/alert.component';
import { ButtonComponent } from '../shared/button/button.component';

describe('SignUpComponent', () => {
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignUpComponent,
        HttpClientTestingModule,
        NgClass,
        NgFor,
        AlertComponent,
        ButtonComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
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

    const setupForm = async () => {
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
      emailInputEl.value = 'user555@mail.com';
      emailInputEl.dispatchEvent(new Event('input'));
      emailInputEl.dispatchEvent(new Event('blur'));
      const passInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="password"]'
      )!;
      passInputEl.value = 'Password1';
      passInputEl.dispatchEvent(new Event('input'));
      const confirmInputEl: HTMLInputElement = signUp.querySelector(
        'input[formControlName="confirmPassword"]'
      )!;
      confirmInputEl.value = 'Password1';
      confirmInputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      button = signUp.querySelector('button')!;
      expect(button.textContent).toContain('Sign Up');
    };

    it('enables the button when pass fields have the same value', async () => {
      await setupForm();
      expect(button.disabled).toBeFalsy();
    });

    it('submit form data', async () => {
      await setupForm();
      button.click();
      const request = httpTestingController.expectOne('/api/1.0/users');
      const body = request.request.body;
      expect(body).toEqual({
        username: 'user1',
        email: 'user555@mail.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
    });

    it('disable button when ongoing api request', async () => {
      await setupForm();
      button.click();
      fixture.detectChanges();
      button.click();
      httpTestingController.expectOne('/api/1.0/users');
      expect(button.disabled).toBeTruthy();
    });

    it('shows spinner while request in progress', async () => {
      await setupForm();
      expect(signUp.querySelector('span[role="status"]')).toBeFalsy();
      expect(signUp.querySelector('.loading-text')).toBeFalsy();
      button.click();
      fixture.detectChanges();
      expect(signUp.querySelector('span[role="status"]')).toBeTruthy();
      expect(signUp.querySelector('.loading-text')).toBeTruthy();
    });

    it('show account activation notification upon successfull request', async () => {
      await setupForm();
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

    it('hide form after successfull sign up', async () => {
      await setupForm();
      expect(
        signUp.querySelector('div[data-testid=sign-up-form]')
      ).toBeTruthy();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});
      fixture.detectChanges();
      expect(signUp.querySelector('div[data-testid=sign-up-form]')).toBeFalsy();
    });

    it('it displays validation error from the backend after submit failure', async () => {
      await setupForm();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush(
        { validationErrors: { email: 'E-mail in use' } },
        { status: 400, statusText: 'Bad Request' }
      );

      fixture.detectChanges();
      const usernameErrorMessage = signUp.querySelector(
        `div[data-testid="email-validation-error"]`
      );
      expect(usernameErrorMessage?.textContent).toContain('E-mail in use');
    });
  });

  describe('Validations', async () => {
    const testCases = [
      {
        field: 'username',
        value: '',
        error: 'Username is required',
      },
      {
        field: 'username',
        value: 'use',
        error: 'Username must have more than 3 characters',
      },
      {
        field: 'email',
        value: '',
        error: 'Email is required',
      },
      {
        field: 'email',
        value: 'user',
        error: 'Please enter a valid Email',
      },
      {
        field: 'password',
        value: '',
        error: 'Password is required',
      },
      {
        field: 'password',
        value: 'password',
        error:
          'Password must have at least 1 uppercase, 1 lowercase and 1 number',
      },
      {
        field: 'confirmPassword',
        value: 'pass',
        error: 'Passwords should match',
      },
    ];

    testCases.forEach(({ field, value, error }) => {
      it(`displayes ${error} when ${field} has '${value}'`, () => {
        let signUp = fixture.nativeElement as HTMLElement;
        const userNameInputEl: HTMLInputElement = signUp.querySelector(
          `input[formControlName="${field}"]`
        )!;
        expect(
          signUp.querySelector(`div[data-testid="${field}-validation-error"]`)
        ).toBeNull();
        userNameInputEl.value = value;
        userNameInputEl.dispatchEvent(new Event('input'));
        userNameInputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const usernameErrorMessage = signUp.querySelector(
          `div[data-testid="${field}-validation-error"]`
        );
        expect(usernameErrorMessage?.textContent).toContain(error);
      });
    });
    // it(`displays email in use when email is not unique`, () => {
    //   let httpTestingController = TestBed.inject(HttpTestingController);
    //   let signUp = fixture.nativeElement as HTMLElement;
    //   const emailInputEl: HTMLInputElement = signUp.querySelector(
    //     `input[formControlName="email"]`
    //   )!;
    //   expect(
    //     signUp.querySelector(`div[data-testid="email-validation-error"]`)
    //   ).toBeNull();
    //   emailInputEl.value = 'not-unique-email@mail.com';
    //   emailInputEl.dispatchEvent(new Event('input'));
    //   emailInputEl.dispatchEvent(new Event('blur'));
    //   const request = httpTestingController.expectOne(
    //     ({ url, method, body }) => {
    //       if (url === '/api/1.0/user/email' && method === 'POST') {
    //         body.email === 'not-unique-email@mail.com';
    //       }
    //       return false;
    //     }
    //   );
    //   request.flush({});
    //   fixture.detectChanges();
    //   const usernameErrorMessage = signUp.querySelector(
    //     `div[data-testid="email-validation-error"]`
    //   );
    //   expect(usernameErrorMessage?.textContent).toContain('E-mail in use');
    // });
  });
});
