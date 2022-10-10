import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './service/api.service';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ValidateService } from './service/validate.service';
import { AuthService } from './service/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth.guard';
import { NotAdminComponent } from './components/not-admin/not-admin.component';
import { AdminComponent } from './components/admin/admin.component';
import { MessageCreateComponent } from './components/message-create/message-create.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageEditComponent } from './components/message-edit/message-edit.component';
import { ActivityComponent } from './components/activity/activity.component';
import { JwtModule } from "@auth0/angular-jwt";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MsgListComponent } from './components/msg-list/msg-list.component';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [
    AppComponent,
    UserCreateComponent,
    UserListComponent,
    UserEditComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    NotAdminComponent,
    AdminComponent,
    MessageCreateComponent,
    MessageListComponent,
    MessageEditComponent,
    ActivityComponent,
    MsgListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    FlashMessagesModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('access_token')
      }
    }
    ),
    MatPaginatorModule,
    MatTableModule,
    MatSortModule
    ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
   ],
  providers: [
    ApiService,
    ValidateService,
    AuthService,
    JwtHelperService,
    AuthGuard,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }



