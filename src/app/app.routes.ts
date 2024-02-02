import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../app/sign-up/sign-up.component').then(
        (mod) => mod.SignUpComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/login/login.component').then((mod) => mod.LoginComponent),
  },
  {
    path: 'user/:id',
    loadComponent: () =>
      import('../app/user/user.component').then((mod) => mod.UserComponent),
  },
  {
    path: 'activation/:id',
    loadComponent: () =>
      import('../app/activate/activate.component').then(
        (mod) => mod.ActivateComponent
      ),
  },
];
