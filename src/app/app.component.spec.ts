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
import { HttpTestingController } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let appComponent: HTMLElement;
  let httpTestingController: HttpTestingController;

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

  describe('Routing', () => {
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
    it('navigates to user detail page when click on a user in the list', fakeAsync(async () => {
      await router.navigate(['/']);
    }));
  });
});
