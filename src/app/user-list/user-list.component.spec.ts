import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { ActivatedRoute } from '@angular/router';

const getPage = (page: number, size: number) => {
  let start = page * size;
  let end = start + size;

  return {
    content: response.content.slice(start, end),
    page,
    size,
    totalPages: Math.ceil(response.content.length / size),
  };
};

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
    {
      id: 4,
      username: 'user4',
      email: 'user4@mail.com',
    },
    {
      id: 5,
      username: 'user5',
      email: 'user5@mail.com',
    },
    {
      id: 6,
      username: 'user6',
      email: 'user6@mail.com',
    },
    {
      id: 7,
      username: 'user7',
      email: 'user7@mail.com',
    },
  ],
  page: 0,
  size: 7,
  totalPages: 4,
};

const activatedRouteMock = {
  snapshot: {
    params: {
      id: '123',
    },
  },
};

const parsePageParams = (req: TestRequest) => {
  let size = Number.parseInt(req.request.params.get('size')!);
  let page = Number.parseInt(req.request.params.get('page')!);

  if (Number.isNaN(page)) {
    page = 0;
  }

  return { size, page };
};

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('it displays 3 users in the list', () => {
    const req = httpTestingController.expectOne(() => true);
    const { page, size } = parsePageParams(req);
    req.flush(getPage(page, size));
    fixture.detectChanges();
    const userItems: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('li');
    expect(userItems.length).toBe(3);
  });

  it('sends size params as three', () => {
    const req = httpTestingController.expectOne(() => true);
    expect(req.request.params.get('size')).toBe('3');
  });

  it('displayes next page button', () => {
    const req = httpTestingController.expectOne(() => true);
    req.flush(getPage(0, 3));
    fixture.detectChanges();
    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[data-testid="next"]'
    );
    expect(nextButton).toBeTruthy();
  });

  it('requests next page after next button click', () => {
    const req = httpTestingController.expectOne(() => true);
    req.flush(getPage(0, 3));
    fixture.detectChanges();
    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[data-testid="next"]'
    );
    expect(nextButton).toBeTruthy();
    nextButton.click();
    const nextReq = httpTestingController.expectOne(() => true);
    expect(nextReq.request.params.get('page')).toBe('1');
  });

  it('hides next button if on last page', () => {
    const req = httpTestingController.expectOne(() => true);
    req.flush(getPage(2, 3));
    fixture.detectChanges();
    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[data-testid="next"]'
    );
    expect(nextButton).toBeFalsy();
  });

  it('does not show previous btn when on first page', () => {
    const req = httpTestingController.expectOne(() => true);
    req.flush(getPage(0, 3));
    fixture.detectChanges();
    const previousButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('button[data-testid="previous"]');
    expect(previousButton).toBeFalsy();
  });
  it('displays previous button in page 2', () => {
    const req = httpTestingController.expectOne(() => true);
    req.flush(getPage(1, 3));
    fixture.detectChanges();
    const previousButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('button[data-testid="previous"]');
    expect(previousButton).toBeTruthy();
    expect(req.request.params.get('page')).toBe('0');
  });

  it('displays spinner when user changes pages', () => {
    const req = httpTestingController.expectOne(() => true);
    expect(
      fixture.nativeElement.querySelector('span[role="status"]')
    ).toBeTruthy();
    req.flush(getPage(1, 3));
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('span[role="status"]')
    ).toBeFalsy();
  });
});
