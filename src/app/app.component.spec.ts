import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app.routes';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ActivateComponent } from './activate/activate.component';
import { UserListComponent } from './user-list/user-list.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoggedInUser } from './core/user.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let appComponent: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientModule,
        HomeComponent,
        SignUpComponent,
        LoginComponent,
        UserComponent,
        NavbarComponent,
        ActivateComponent,
        UserListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appComponent = fixture.nativeElement;
  });

  afterEach(() => {
    // localStorage.clear();
  });

  describe('Routing', () => {
    localStorage.clear();
    const testCases = [
      {
        path: '/',
        component: 'home-page',
      },
      { path: '/signup', component: 'signup-page' },
      { path: '/login', component: 'login-page' },
      { path: '/user/1', component: 'user-page' },
      { path: '/activation/1', component: 'activation-page' },
    ];

    testCases.forEach(({ path, component }) => {
      it(`Loads ${component} at ${path}`, async () => {
        await router.navigate([path]);
        fixture.detectChanges();
        const page: HTMLElement = appComponent.querySelector(
          `[data-testid=${component}]`
        )!;
        expect(page).toBeTruthy();
      });
    });

    const linkTests = [
      { path: '/', title: 'Home' },
      { path: '/signup', title: 'Sign up' },
      { path: '/login', title: 'Login' },
    ];
    linkTests.forEach(({ path, title }) => {
      it(`It has link with title ${title} to path ${path}`, () => {
        const linkElement: HTMLAnchorElement = appComponent.querySelector(
          `a[title="${title}"]`
        )!;
        expect(linkElement.pathname).toEqual(path);
      });
    });

    const navigationTests = [
      {
        initialPath: '/login',
        navigationTo: 'Sign up',
        renderedPage: 'signup-page',
      },
      {
        initialPath: '/signup',
        navigationTo: 'Home',
        renderedPage: 'home-page',
      },
      {
        initialPath: '/',
        navigationTo: 'Login',
        renderedPage: 'login-page',
      },
    ];
    navigationTests.forEach(({ initialPath, navigationTo, renderedPage }) => {
      // it(`renderes ${renderedPage} after navigation to ${navigationTo} link`, fakeAsync(async () => {
      //   await router.navigate([initialPath]);
      //   tick();
      //   fixture.detectChanges();
      //   const linkElement: HTMLAnchorElement = appComponent.querySelector(
      //     `a[title="${navigationTo}"]`
      //   )!;
      //   linkElement.click();
      //   tick();
      //   fixture.detectChanges();
      //   await fixture.whenStable();
      //   const page: HTMLElement = appComponent.querySelector(
      //     `[data-testid=${renderedPage}]`
      //   )!;
      //   expect(page).toBeTruthy();
      // }));
    });
    // it('navigates to user detail page when click on a user in the list', fakeAsync(async () => {
    //   await router.navigate(['/']);
    // }));
  });

  describe('Login', () => {
    let httpTestingController: HttpTestingController;
    let button: HTMLButtonElement;
    let login: HTMLElement;
    let emailInputEl: HTMLInputElement;
    let passInputEl: HTMLInputElement;

    const setuplogin = fakeAsync(async () => {
      await router.navigate(['/login']);
      fixture.detectChanges();
      httpTestingController = TestBed.inject(HttpTestingController);
      login = fixture.nativeElement;
      emailInputEl = login.querySelector('input[formControlName="email"]')!;
      emailInputEl.value = 'user1@mail.com';
      emailInputEl.dispatchEvent(new Event('input'));

      passInputEl = login.querySelector('input[formControlName="password"]')!;
      passInputEl.value = 'P4ssword';
      passInputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      button = login.querySelector('button')!;
      expect(button.textContent).toContain('Login');
      button.click();
      const req = httpTestingController.expectOne(() => true);
      req.flush({
        id: 1,
        username: 'user1',
        email: 'user1@mail.com',
      });
      fixture.detectChanges();
      tick();
      let user = {
        id: 1,
        username: 'user1',
        email: 'user1@mail.com',
        isLoggedIn: true,
      };
      localStorage.setItem('user', JSON.stringify(user));
    });

    it('redirects to homepage after successful login', async () => {
      await setuplogin();
      const homePage: HTMLElement = appComponent.querySelector(
        '[data-testid="home-page"]'
      )!;
      expect(homePage).toBeTruthy();
    });

    it('hides login and signup links after login', async () => {
      await setuplogin();
      const loginLinkElement: HTMLAnchorElement =
        appComponent.querySelector('a[title="Login"]')!;
      expect(loginLinkElement).toBeFalsy();
      const signUpLinkElement: HTMLAnchorElement =
        appComponent.querySelector('a[title="Sign up"]')!;
      expect(signUpLinkElement).toBeFalsy();
    });

    it('shows my profile link element upon login', async () => {
      await setuplogin();
      const myProfileLinkElement: HTMLAnchorElement =
        appComponent.querySelector('a[title="My Profile"]')!;
      expect(myProfileLinkElement).toBeTruthy();
    });

    it('shows user profile page when my profile is clicked', async () => {
      await setuplogin();
      const myProfileLinkElement: HTMLAnchorElement =
        appComponent.querySelector('a[title="My Profile"]')!;
      expect(myProfileLinkElement).toBeTruthy();
      myProfileLinkElement.click();
      await router.navigate(['/user/1']);
      fixture.detectChanges();
      const profilePage: HTMLElement = appComponent.querySelector(
        '[data-testid="user-page"]'
      )!;
      expect(profilePage).toBeTruthy();
      expect(router.url).toEqual('/user/1');
    });

    it('stores user data in local storage', async () => {
      await setuplogin();
      const userData: LoggedInUser = JSON.parse(localStorage.getItem('user')!);
      expect(userData.isLoggedIn).toBe(true);
    });

    it('displays layout of logged in user', async () => {
      let user = {
        id: 1,
        username: 'user1',
        email: 'user1@mail.com',
        isLoggedIn: true,
      };
      localStorage.setItem('user', JSON.stringify(user));
      await router.navigate(['/']);
      fixture.detectChanges();
      const myProfileLinkElement: HTMLAnchorElement =
        appComponent.querySelector('a[title="My Profile"]')!;
      expect(myProfileLinkElement).toBeTruthy();
    });

    it('shows logout link element when logged in', async () => {
      await setuplogin();
      const logoutLinkElement: HTMLAnchorElement =
        appComponent.querySelector('a[title="Logout"]')!;
      expect(logoutLinkElement).toBeTruthy();
    });

    it('should clear local storage and redirected to login page when user logs out', async () => {
      await setuplogin();
      const logoutLinkElement: HTMLAnchorElement =
        appComponent.querySelector('a[title="Logout"]')!;
      expect(logoutLinkElement).toBeTruthy();
      logoutLinkElement.click();
      localStorage.removeItem('user');
      await router.navigate(['/login']);
      const loginPage: HTMLElement = appComponent.querySelector(
        '[data-testid="login-page"]'
      )!;
      expect(loginPage).toBeTruthy();
    });
  });
});
