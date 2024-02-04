import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AlertComponent } from '../shared/alert/alert.component';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let httpTestingController: HttpTestingController;

  let activatedRouteMock = {
    snapshot: {
      params: {
        id: '1',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent, HttpClientTestingModule, AlertComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends req to get user data', () => {
    const reqs = httpTestingController.match('/api/1.0/users/1');
    expect(reqs.length).toBe(1);
  });

  it('displays username on page when user is found', () => {
    const req = httpTestingController.expectOne('/api/1.0/users/1');
    req.flush({
      id: 1,
      username: 'user1',
      email: 'user1@mail.com',
    });
    fixture.detectChanges();
    const usernameEl: HTMLElement = fixture.nativeElement.querySelector('p');
    const userEmailEl: HTMLElement = fixture.nativeElement.querySelector('h5');
    expect(usernameEl.textContent).toContain('user1');
    expect(userEmailEl.textContent).toContain('user1@mail.com');
  });

  it('displays error when user not found', () => {
    const req = httpTestingController.expectOne('/api/1.0/users/1');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    const errorMessage: HTMLElement =
      fixture.nativeElement.querySelector('h3');
    expect(errorMessage.textContent).toContain('User Not Found');
  });

  it('displays loading spinner during a request', () => {
    const req = httpTestingController.expectOne('/api/1.0/users/1');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('span[role="status"]')
    ).toBeTruthy();
    req.flush({}, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('span[role="status"]')
    ).toBeFalsy();
  });
});
