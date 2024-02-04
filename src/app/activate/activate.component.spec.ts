import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateComponent } from './activate.component';
import { ActivatedRoute } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AlertComponent } from '../shared/alert/alert.component';

describe('ActivateComponent', () => {
  let component: ActivateComponent;
  let fixture: ComponentFixture<ActivateComponent>;
  let httpTestingController: HttpTestingController;

  const activatedRouteMock = {
    snapshot: {
      params: {
        id: '123',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateComponent, HttpClientTestingModule, AlertComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends account activation req', () => {
    const reqs = httpTestingController.match('/api/1.0/users/token/123');
    expect(reqs.length).toBe(1);
  });

  it('displays activation success message when token is valid', () => {
    const req = httpTestingController.expectOne('/api/1.0/users/token/123');
    req.flush({});
    fixture.detectChanges();
    const alertComponent: HTMLElement =
      fixture.nativeElement.querySelector('.alert');
    expect(alertComponent.textContent).toContain('Account is activated');
  });

  it('displays activation failure message when token is  invalid', () => {
    const req = httpTestingController.expectOne('/api/1.0/users/token/123');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    const alertComponent: HTMLElement =
      fixture.nativeElement.querySelector('.alert');
    expect(alertComponent.textContent).toContain('Account activation failed');
  });
  it('displays loading spinner during a request', () => {
    const req = httpTestingController.expectOne('/api/1.0/users/token/123');
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
