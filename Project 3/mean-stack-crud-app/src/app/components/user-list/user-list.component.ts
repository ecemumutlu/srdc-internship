
import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ignoreElements } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  User:any = [];
  UserObject: Object;

  constructor(
    private apiService: ApiService,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
    ) {
      this.someMethod();

  }
  ngOnInit() {
    this.readUser();

  }

  readUser(){
    //console.log(this.UserObject);
    this.apiService.getUsers().subscribe((data: any) => {
      if(data.success){
        this.User = data.msg;
        this.callAddActivity('see-all-users');
      }
      else{
        this.onClearClick();
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
      }

    })
  }


  onClearClick(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  removeUser(user, index) {
    if(window.confirm('Are you sure?')) {
      this.apiService.deleteUser(user._id).subscribe((data => {
        if((data as any).success){
          this.User.splice(index, 1);
          console.log("remove user'da");
          this.callAddActivity('deleted ' + user.username);
        }
        else{
          this.onClearClick();
          this.flashMessage.show((data as any).msg, {cssClass: 'alert-danger', timeout: 5000});
        }
      })
    )
  }

  }


  someMethod(){
    const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.UserObject = token;
  }

  callAddActivity(op){
    if(op === 'see-all-users'){
      console.log(this.UserObject);
      const activity = {
        userId: this.UserObject['_id'],
        username: this.UserObject['username'],
        operation: op,
        date: Date.now(),
        description: ''
      };

      this.authService.addActivity(activity).subscribe((data: any) =>{
        if(data.success){
          console.log('Activity added.');
        }
        else{
          console.log('Something went wrong in log operation of see-all-users');
        }
      })
    }
    else {
      console.log(this.UserObject);
      const activity = {
        userId: this.UserObject['id'],
        username: this.UserObject['username'],
        operation: op,
        date: Date.now(),
        description: this.UserObject['username'] + op
      };

      this.authService.addActivity(activity).subscribe((data: any) =>{
        if(data.success){
          console.log('Activity added.');
        }
        else{
          console.log('Something went wrong in log operation of see-all-users');
        }
      })
    }
  }




}
