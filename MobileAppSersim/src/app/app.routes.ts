import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes)
  },
  {
    path: 'superAdmin',
    canActivate: [AuthGuard],
     loadChildren: () => import('./superAdmin/superAdmin.routes').then(m => m.routes)
   // loadComponent: () => import('./superAdmin/user-management.page').then(m => m.UserManagementPage),

  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
