import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import userEvent from '@testing-library/user-event';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ActivateComponent } from './activate/activate.component';

const setup = async (path: string) => {
  const { navigate } = await render(AppComponent, {
    imports: [
      AppComponent,
      HttpClientModule,
      HomeComponent,
      SignUpComponent,
      LoginComponent,
      UserComponent,
      NavbarComponent,
      ReactiveFormsModule,
      ActivateComponent,
    ],
    routes: routes,
  });
  await navigate(path);
};

describe('Routing', () => {
  it.each`
    path               | pageId
    ${'/'}             | ${'home-page'}
    ${'/signup'}       | ${'signup-page'}
    ${'/login'}        | ${'login-page'}
    ${'/user/1'}       | ${'user-page'}
    ${'/activation/1'} | ${'activation-page'}
  `('renders &page when path is $path', async ({ path, pageId }) => {
    await setup(path);
    const component = screen.queryByTestId(pageId);
    expect(component).toBeInTheDocument();
  });

  it.each`
    path         | linkTitle
    ${'/'}       | ${'Home'}
    ${'/signup'} | ${'Sign Up'}
    ${'/login'}  | ${'Login'}
  `('has link to $linkTitle to $path', async ({ path, linkTitle }) => {
    await setup(path);
    const link = screen.getByRole('link', { name: linkTitle });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | navigatingTo | renderedPage
    ${'/login'}  | ${'Sign Up'} | ${'signup-page'}
    ${'/login'}  | ${'Home'}    | ${'home-page'}
    ${'/signup'} | ${'Login'}   | ${'login-page'}
  `(
    'renders $renderedPage after navigating to $navigatingTo',
    async ({ initialPath, navigatingTo, renderedPage }) => {
      await setup(initialPath);
      const link = screen.getByRole('link', { name: navigatingTo });
      await userEvent.click(link);
      const page = await screen.findByTestId(renderedPage);
      expect(page).toBeInTheDocument();
    }
  );
});
