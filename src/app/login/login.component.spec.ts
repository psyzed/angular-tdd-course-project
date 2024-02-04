import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('layout', () => {
    it('has sign up header', () => {
      const login: HTMLElement = fixture.nativeElement;
      const h1 = login.querySelector('h1');
      expect(h1?.textContent).toBe('Login');
    });
  });

  it('has email input element', () => {
    const login: HTMLElement = fixture.nativeElement;
    const labelEl: HTMLElement = login.querySelector('label[for="email"]')!;
    const userNameInputEl: HTMLInputElement = login.querySelector(
      'input[formControlName="email"]'
    )!;
    expect(userNameInputEl).toBeTruthy();
    expect(labelEl).toBeTruthy();
    expect(labelEl.textContent).toContain('Email');
  });

  it('has password input element', () => {
    const login: HTMLElement = fixture.nativeElement;
    const labelEl: HTMLElement = login.querySelector('label[for="password"]')!;
    const passInputEl: HTMLInputElement = login.querySelector(
      'input[formControlName="password"]'
    )!;
    expect(labelEl).toBeTruthy();
    expect(labelEl.textContent).toContain('Password');
    expect;
    expect(passInputEl).toBeTruthy();
    expect(passInputEl.type).toBe('password');
  });

  it('has login button element', () => {
    const login = fixture.nativeElement;
    const buttonEl: HTMLButtonElement = login.querySelector('button');
    expect(buttonEl.textContent).toContain('Login');
    expect(buttonEl.type).toBe('button');
  });

  it('button disabled initially', () => {
    const login = fixture.nativeElement;
    const buttonEl: HTMLButtonElement = login.querySelector('button');
    expect(buttonEl.textContent).toContain('Login');
    expect(buttonEl.disabled).toBeTruthy();
  });

  describe('interactions', () => {
    let httpTestingController: HttpTestingController;
    let button: HTMLButtonElement;
    let login: HTMLElement;
    let emailInputEl: HTMLInputElement;
    let passInputEl: HTMLInputElement;

    const setupForm = async () => {
      httpTestingController = TestBed.inject(HttpTestingController);
      login = fixture.nativeElement;
      emailInputEl = login.querySelector('input[formControlName="email"]')!;
      emailInputEl.value = 'user555@mail.com';
      emailInputEl.dispatchEvent(new Event('input'));

      passInputEl = login.querySelector('input[formControlName="password"]')!;
      passInputEl.value = 'Password1';
      passInputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      button = login.querySelector('button')!;
      expect(button.textContent).toContain('Login');
    };

    it('enables the button when form is valid', async () => {
      await setupForm();
      expect(button.disabled).toBeFalsy();
    });

    it('submit form data', async () => {
      await setupForm();
      button.click();
      const request = httpTestingController.expectOne('/api/1.0/auth');
      const body = request.request.body;
      expect(body).toEqual({
        email: 'user555@mail.com',
        password: 'Password1',
      });
    });

    it('disable button when ongoing api request', async () => {
      await setupForm();
      button.click();
      fixture.detectChanges();
      button.click();
      httpTestingController.expectOne('/api/1.0/auth');
      expect(button.disabled).toBeTruthy();
    });

    it('shows spinner while request in progress', async () => {
      await setupForm();
      expect(login.querySelector('span[role="status"]')).toBeFalsy();
      expect(login.querySelector('.loading-text')).toBeFalsy();
      button.click();
      fixture.detectChanges();
      expect(login.querySelector('span[role="status"]')).toBeTruthy();
      expect(login.querySelector('.loading-text')).toBeTruthy();
    });

    it('hide spinner upon request failure', async () => {
      await setupForm();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/auth');
      req.flush(
        {},
        {
          status: 401,
          statusText: 'Unauthorized',
        }
      );
      fixture.detectChanges();
      expect(login.querySelector('span[role="status"]')).toBeFalsy();
      expect(login.querySelector('.loading-text')).toBeFalsy();
    });

    it('shows error message if login not successful', async () => {
      await setupForm();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/auth');
      req.flush(
        {},
        {
          status: 401,
          statusText: 'Unauthorized',
        }
      );
      fixture.detectChanges();
      expect(login.querySelector('div[role="alert"]')).toBeTruthy();
    });

    it('error message is cleared if the inputs are changed', async () => {
      await setupForm();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/auth');
      req.flush(
        {},
        {
          status: 401,
          statusText: 'Unauthorized',
        }
      );
      fixture.detectChanges();
      expect(login.querySelector('div[role="alert"]')).toBeTruthy();
      emailInputEl.value = 'lazaros@gmail.com';
      emailInputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(login.querySelector('div[role="alert"]')).toBeFalsy();
    });
  });

  describe('Validations', async () => {
    const testCases = [
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
    ];

    testCases.forEach(({ field, value, error }) => {
      it(`displayes ${error} when ${field} has '${value}'`, () => {
        let login = fixture.nativeElement as HTMLElement;
        const inputEl: HTMLInputElement = login.querySelector(
          `input[formControlName="${field}"]`
        )!;
        expect(
          login.querySelector(`div[data-testid="${field}-validation-error"]`)
        ).toBeNull();
        inputEl.value = value;
        inputEl.dispatchEvent(new Event('input'));
        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const usernameErrorMessage = login.querySelector(
          `div[data-testid="${field}-validation-error"]`
        );
        expect(usernameErrorMessage?.textContent).toContain(error);
      });
    });
  });
});
