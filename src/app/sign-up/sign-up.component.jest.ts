import { render, screen } from '@testing-library/angular';
import { SignUpComponent } from './sign-up.component';
import userEvent from '@testing-library/user-event';
import 'whatwg-fetch';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { NgClass, NgIf } from '@angular/common';
import { AlertComponent } from '../shared/alert/alert.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';

let requestBody: any;
let counter = 0;
const server = setupServer(
  http.post('/api/1.0/users', async ({ request }) => {
    requestBody = await request.json();
    counter += 1;
    return new HttpResponse(null, {
      status: 200,
    });
  })
);

beforeEach(() => {
  counter = 0;
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const setup = async () => {
  await render(SignUpComponent, {
    imports: [
      HttpClientTestingModule,
      NgClass,
      NgIf,
      AlertComponent,
      ButtonComponent,
      ReactiveFormsModule,
    ],
  });
};

describe('SignUpComponent', () => {
  it('has Sign Up header', async () => {
    await setup();
    const header = screen.getByRole('heading', { name: 'Sign Up' });
    expect(header).toBeInTheDocument();
  });

  it('has user input element', async () => {
    await setup();
    const userInputElement = screen.getByPlaceholderText('Username');
    const label = screen.getByLabelText('Username');
    expect(label).toBeInTheDocument();
    expect(userInputElement).toBeInTheDocument();
    expect(userInputElement).toHaveAttribute('formControlName', 'username');
  });

  it('has email input element', async () => {
    await setup();
    const emailInputElement = screen.getByPlaceholderText('E-mail');
    const label = screen.getByLabelText('E-mail');
    expect(emailInputElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('has password input element', async () => {
    await setup();
    const passwordInputElement = screen.getByPlaceholderText('Password');
    const label = screen.getByLabelText('Password');
    expect(passwordInputElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('has confirm password input element', async () => {
    await setup();
    const confirmPasswordInputElement =
      screen.getByPlaceholderText('Confirm Password');
    const label = screen.getByLabelText('Confirm Password');
    expect(confirmPasswordInputElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('has submit button element', async () => {
    await setup();
    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    expect(submitButtonElement).toHaveAttribute('type', 'button');
    expect(submitButtonElement).toBeDisabled();
  });
});

describe('interactions', () => {
  it('enables the button when pass fields have the same value', async () => {
    await setup();
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    const emailInputEl: HTMLInputElement =
      screen.getByPlaceholderText('E-mail');
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Password');
    const confirmPasswordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Confirm Password');
    await userEvent.type(usernameInputEl, 'user1');
    await userEvent.type(emailInputEl, 'user@gmail.com');
    await userEvent.type(passwordInputElement, 'Password1');
    await userEvent.type(confirmPasswordInputElement, 'Password1');
    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    expect(submitButtonElement).toHaveAttribute('type', 'button');
    expect(submitButtonElement).toBeEnabled();
  });

  it('sends form data', async () => {
    await setup();
    const httpTestingController = TestBed.inject(HttpTestingController);
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    const emailInputEl: HTMLInputElement =
      screen.getByPlaceholderText('E-mail');
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Password');
    const confirmPasswordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Confirm Password');
    await userEvent.type(usernameInputEl, 'user1');
    await userEvent.type(emailInputEl, 'user@gmail.com');
    await userEvent.type(passwordInputElement, 'Password1');
    await userEvent.type(confirmPasswordInputElement, 'Password1');
    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    expect(submitButtonElement).toHaveAttribute('type', 'button');
    expect(submitButtonElement).toBeEnabled();
    await userEvent.click(submitButtonElement);
    const request = httpTestingController.expectOne('/api/1.0/users');
    const body = request.request.body;
    expect(body).toEqual({
      username: 'user1',
      email: 'user@gmail.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    });
  });

  it('disable button for api call', async () => {
    await setup();
    const httpTestingController = TestBed.inject(HttpTestingController);
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    const emailInputEl: HTMLInputElement =
      screen.getByPlaceholderText('E-mail');
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Password');
    const confirmPasswordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Confirm Password');
    await userEvent.type(usernameInputEl, 'user1');
    await userEvent.type(emailInputEl, 'user@gmail.com');
    await userEvent.type(passwordInputElement, 'Password1');
    await userEvent.type(confirmPasswordInputElement, 'Password1');
    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    expect(submitButtonElement).toHaveAttribute('type', 'button');
    expect(submitButtonElement).toBeEnabled();
    await userEvent.click(submitButtonElement);
    const request = httpTestingController.expectOne('/api/1.0/users');
    expect(submitButtonElement).toBeDisabled();
  });

  it('shows spinner while request in progress', async () => {
    await setup();
    const httpTestingController = TestBed.inject(HttpTestingController);
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    const emailInputEl: HTMLInputElement =
      screen.getByPlaceholderText('E-mail');
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Password');
    const confirmPasswordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Confirm Password');
    await userEvent.type(usernameInputEl, 'user1');
    await userEvent.type(emailInputEl, 'user@gmail.com');
    await userEvent.type(passwordInputElement, 'Password1');
    await userEvent.type(confirmPasswordInputElement, 'Password1');
    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    expect(
      screen.queryByRole('status', { hidden: true })
    ).not.toBeInTheDocument();
    await userEvent.click(submitButtonElement);
    expect(screen.queryByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('show account activation notification upon successfull request', async () => {
    await setup();
    const httpTestingController = TestBed.inject(HttpTestingController);
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    const emailInputEl: HTMLInputElement =
      screen.getByPlaceholderText('E-mail');
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Password');
    const confirmPasswordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Confirm Password');
    await userEvent.type(usernameInputEl, 'user1');
    await userEvent.type(emailInputEl, 'user@gmail.com');
    await userEvent.type(passwordInputElement, 'Password1');
    await userEvent.type(confirmPasswordInputElement, 'Password1');
    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    expect(
      screen.queryByText('Please check your e-mail to activate your account')
    ).not.toBeInTheDocument();
    await userEvent.click(submitButtonElement);
    const request = httpTestingController.expectOne('/api/1.0/users');
    request.flush({});
    expect(
      await screen.findByText(
        'Please check your e-mail to activate your account'
      )
    ).toBeInTheDocument();
  });

  it('hide form after successfull sign up', async () => {
    await setup();
    const form = screen.getByTestId('sign-up-form');
    const httpTestingController = TestBed.inject(HttpTestingController);
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    const emailInputEl: HTMLInputElement =
      screen.getByPlaceholderText('E-mail');
    const passwordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Password');
    const confirmPasswordInputElement: HTMLInputElement =
      screen.getByPlaceholderText('Confirm Password');
    await userEvent.type(usernameInputEl, 'user1');
    await userEvent.type(emailInputEl, 'user@gmail.com');
    await userEvent.type(passwordInputElement, 'Password1');
    await userEvent.type(confirmPasswordInputElement, 'Password1');
    const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(submitButtonElement);
    const request = httpTestingController.expectOne('/api/1.0/users');
    expect(request.request.url).toEqual('/api/1.0/users');
    expect(request.request.method).toEqual('POST');
    await request.flush({});
    expect(form).toBeInTheDocument();
  });

  //   it(`displays email in use when email is not unique`, async () => {
  //     server.use(
  //       http.post('/api/1.0/users', async ({ request }) => {
  //         requestBody = await request.json();
  //         counter += 1;
  //         return new HttpResponse(null, {
  //           status: 400,
  //         });
  //       })
  //     );
  //     await setup();
  //     const submitButtonElement = screen.getByRole('button', { name: 'Sign Up' });
  //     await userEvent.click(submitButtonElement);
  //     const errorMessage = await screen.findByText('E-mail in use');
  //     expect(errorMessage).toBeInTheDocument();
  //   });
});

describe('validations', () => {
  it.each`
    placeholder           | inputValue              | message
    ${'Username'}         | ${'{space}{backspace}'} | ${'Username is required'}
    ${'Username'}         | ${'123'}                | ${'Username must have more than 3 characters'}
    ${'E-mail'}           | ${'{space}{backspace}'} | ${'Email is required'}
    ${'E-mail'}           | ${'user'}               | ${'Please enter a valid Email'}
    ${'Password'}         | ${'{space}{backspace}'} | ${'Password is required'}
    ${'Password'}         | ${'password'}           | ${'Password must have at least 1 uppercase, 1 lowercase and 1 number'}
    ${'Confirm Password'} | ${'pass'}               | ${'Passwords should match'}
  `(
    'displays $message when $label has the value "$inputValue"',
    async ({ placeholder, inputValue, message }) => {
      await setup();
      const input: HTMLInputElement = screen.getByPlaceholderText(placeholder);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      await userEvent.type(input, inputValue);
      await userEvent.tab();
      expect(screen.queryByText(message)).toBeInTheDocument();
    }
  );

  it('error message if username empty', async () => {
    await setup();
    const form = screen.getByTestId('sign-up-form');
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
    await userEvent.click(usernameInputEl);
    await userEvent.tab();
    expect(screen.queryByText('Username is required')).toBeInTheDocument();
  });

  it('username too short', async () => {
    await setup();
    const form = screen.getByTestId('sign-up-form');
    const usernameInputEl: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    expect(
      screen.queryByText('Username must have more than 3 characters')
    ).not.toBeInTheDocument();
    await userEvent.type(usernameInputEl, 'use');
    await userEvent.tab();
    expect(
      screen.queryByText('Username must have more than 3 characters')
    ).toBeInTheDocument();
  });
});
