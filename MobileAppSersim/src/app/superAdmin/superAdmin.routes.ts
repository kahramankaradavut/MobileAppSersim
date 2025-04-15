import { RouterModule, Routes } from '@angular/router';
import { UserManagementPage } from './user-management.page';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: UserManagementPage,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'superAdmin',
        loadComponent: () => import('../superAdmin/user-management.page').then(m => m.UserManagementPage),
      },
      {
        path: '',
        redirectTo: 'superAdmin',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('../login/login.page').then(m => m.LoginPage)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
