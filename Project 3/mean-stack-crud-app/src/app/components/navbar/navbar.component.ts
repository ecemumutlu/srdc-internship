import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: Object;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private jwtHelper: JwtHelperService
  ) {
    this.readProfile();
  }

  ngOnInit(): void {
  }

  readProfile(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.user = token;
  }

  onLogoutClick(){
    this.callAddActivity();

    this.authService.logout();
    this.flashMessage.show('You are logged out',{cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/login']);
    return false;
  }

  callAddActivity(){
    const activity = {

      userId: this.user['id'],
      username: this.user['username'],
      operation: 'logout',
      date: Date.now(),
      description: ''
    };

    this.authService.addActivity(activity).subscribe((data: any) =>{
      if(data.success){
        console.log('Activity added.');
      }
      else{
        console.log('Something went wrong in log operation of login');
      }
    })
  }



}
