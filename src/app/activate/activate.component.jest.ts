import { render, screen, waitFor } from '@testing-library/angular';
import { ActivateComponent } from './activate.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { UserService } from '../core/user.service';
import { setupWorker } from 'msw/browser'

let counter = 1;
let requestBody: any;

const activatedRouteMock = {
  snapshot: {
    params: {
      id: '123',
    },
  },
};

const server = setupServer(
  http.post('/api/1.0/users/token/:token', async ({ request }) => {
    counter += 1;
    return new HttpResponse(null, {});
  })
);

const setup = async () => {
  await render(ActivateComponent, {
    imports: [AlertComponent, HttpClientModule],
    providers: [
      { provide: UserService },
      { provide: ActivatedRoute, useValue: activatedRouteMock },
    ],
  });
};

beforeEach(() => {
  counter = 0;
});

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

describe('Account activation page', () => {
  it('sends account activation req', async () => {
    await setup();
    await waitFor(() => {
      expect(counter).toBe(1);
    });
  });

  it('displays activation success message when token is valid', () => {});

  it('displays activation failure message when token is  invalid', () => {});
});
