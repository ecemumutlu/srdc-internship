import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { NotAdminComponent } from './components/not-admin/not-admin.component';
import { MessageCreateComponent } from './components/message-create/message-create.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageEditComponent } from './components/message-edit/message-edit.component';
import { ActivityComponent } from './components/activity/activity.component';
import { MsgListComponent } from './components/msg-list/msg-list.component';


const routes: Routes = [
  //{ path: '', pathMatch: 'full', redirectTo: 'create-user' },
  { path: '', component: HomeComponent },
  { path: 'register/:id/:user', component: RegisterComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent,canActivate: [AuthGuard] },
  { path: 'notAdmin', component: NotAdminComponent,canActivate: [AuthGuard] },
  { path: 'create-message', component: MessageCreateComponent,canActivate: [AuthGuard] },
  { path: 'user.route/msg-list/:id', component: MsgListComponent,canActivate: [AuthGuard] },
  { path: 'edit-message/:id', component: MessageEditComponent, canActivate: [AuthGuard] },
  { path: 'get-activities' , component: ActivityComponent, canActivate: [AuthGuard] },
  { path: 'users-list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'edit-user/:id', component: UserEditComponent, canActivate: [AuthGuard] }

  //{ path: 'user.route/messages-list/:id', component: MessageListComponent },
 // { path: 'create-user', component: UserCreateComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
