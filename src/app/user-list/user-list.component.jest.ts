import { render, screen, waitFor } from '@testing-library/angular';
import { UserListComponent } from './user-list.component';
import { HttpClientModule } from '@angular/common/http';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

const response = {
  content: [
    {
      id: 1,
      username: 'user1',
      email: 'user1@mail.com',
    },
    {
      id: 2,
      username: 'user2',
      email: 'user2@mail.com',
    },
    {
      id: 3,
      username: 'user3',
      email: 'user3@mail.com',
    },
  ],
};

const server = setupServer(
  http.get('/api/1.0/users', async ({ request }) => {
    return HttpResponse.json(response.content);
  })
);

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('User List', () => {
  it('displays three users in list', async () => {
    await render(UserListComponent, {
      imports: [HttpClientModule],
    });
    await waitFor(() => {
      expect(screen.queryAllByText(/user/).length).toBe(3);
    });
  });
});
